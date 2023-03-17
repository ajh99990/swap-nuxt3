<template>
	<div class="pt-60px px-15px">
		<div v-if="imgLoading" class="h-100vh flex items-center justify-center">
			<Loading />
		</div>
		<div v-if="finished && !pageList.length" class="h-100vh flex items-center justify-center">
			<Empty emptyStr="暂无历史记录" emptyType="coin" />
		</div>
		<van-list v-else v-model:loading="listLoading" :finished="finished" :immediate-check="false" finished-text="-我是有底线的-" @load="onLoad">
			<div @click="toDetailPage(item.orderNo)" v-for="item,index in pageList" :key="index" class="bg-[#FFF] rounded-8px pt-1px pb-12px mb-12px">
				<TradingPair :tradingPair="item.tradingPair" :showImg="true" />
				<div class="bg-[#e6eaf5] h-1px border-style border-solid border-[#e6eaf5] w-313px ml-15px"></div>
				<div class="flex items-center justify-between text-12px leading-17px text-[#7e84a3] px-15px mt-11.5px">
					<p>下单时间 {{ item.createTime }}</p>
					<p class="flex items-center">
						<span class="mr-6px">用时{{ item.preTime }}</span>
						<img src="~~/assets/images/successState.png" class="w-14px" />
					</p>
					<!-- <p class="flex items-center">
						<span class="mr-6px">用时{{ item.preTime }}</span>
						<img src="~~/assets/images/successState.png" class="w-14px" />
					</p>
					<p class="flex items-center">
						<span class="mr-6px">预计用时{{ item.preTime }}</span>
						<img src="~~/assets/images/successState.png" class="w-14px" />
					</p>-->
				</div>
			</div>
		</van-list>
	</div>
</template>

<script setup>
import BigNumber from "bignumber.js";
import useBaseApi from "~~/api/useBaseApi";
import { getShowTime, getStringNum } from "~~/helper/common";
import useGlobalData from "~~/store/useGlobalData";

const props = defineProps({
	stateCode: String,
	timeCode: String,
});

watch(
	() => [props.stateCode, props.timeCode],
	async () => {
		imgLoading.value = true;
		pageList.value = [];
		finished.value = false;
		currentPage.value = 1;
		getPageList();
	}
);

const listTotal = ref(0);
const currentPage = ref(1);
const pageList = ref([]);
const listLoading = ref(true);
const finished = ref(false);
const imgLoading = ref(true);

const getPageList = async () => {
	const baseApi = useBaseApi();
	const globalData = useGlobalData();
	baseApi.get(({ api }) => {
		return {
			api: api.ordePpage,
			params: {
				address: globalData.ownerAddress,
				status: props.stateCode,
				timeType: props.timeCode,
				current: currentPage.value,
			},
			success: (res) => {
				const handleList = [];
				res.records.map((item) => {
					if (item.status == "proccessing") {
						getResultState(item.order_no);
					}
					handleList.push({
						orderNo: item.order_no,
						createTime: item.create_time,
						stageType: item.status,
						preTime: item.pre_time,
						completeTime: getShowTime(
							new Date(item.complete_time) -
								new Date(item.create_time)
						),
						tradingPair: [
							{
								type: "pay",
								logo: item.token0_logo,
								symbol: item.symbol0,
								chain: item.token0_chain,
								amount: getStringNum(
									BigNumber(item.amount0).shiftedBy(
										-item.decimals0
									),
									item.decimals0 > 8 ? 8 : item.decimals0
								),
							},
							{
								type: "receive",
								logo: item.token1_logo,
								symbol: item.symbol1,
								chain: item.token1_chain,
								amount: getStringNum(
									BigNumber(item.amount1).shiftedBy(
										-item.decimals1
									),
									item.decimals1 > 8 ? 8 : item.decimals1
								),
							},
						],
					});
				});
				pageList.value = pageList.value.concat(handleList);
				listTotal.value = Number(res.total);
				if (!pageList.value.length) {
					finished.value = true;
				}
				listLoading.value = false;
				imgLoading.value = false;
			},
		};
	});
};

const getResultState = (orderNo) => {
	const baseApi = useBaseApi();
	baseApi.get(({ api }) => {
		return {
			api: api.getDetailByOrderNo,
			params: { orderNo },
			success: async (res) => {
				let state;
				if (res.status == "proccessing") {
					setTimeout(() => {
						getResultState(orderNo);
					}, 30000);
				} else {
					state = res.status;
				}
				pageList.value.map((item) => {
					if (item.orderNo == orderNo) {
						item.stageType = state;
					}
				});
			},
			fail: (err) => {
				console.log(err);
				setTimeout(() => {
					getResultState(orderNo);
				}, 3000);
			},
		};
	});
};

const onLoad = () => {
	if (pageList.value.length >= listTotal.value) {
		listLoading.value = false;
		finished.value = false;
		return;
	}

	currentPage.value++;
	getPageList();
};

const toDetailPage = (orderNo) => {
	const router = useRouter();
	router.push(`/resultDetail?orderNo=${orderNo}`);
};

onMounted(() => {
	getPageList();
});
</script>

<style lang="scss" scoped>
.border-style {
	border-width: calc(0.5px);
}
</style>