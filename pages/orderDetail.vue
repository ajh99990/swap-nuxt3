<template>
	<div class="h-100vh px-15px">
		<div v-if="tradeInfo.status">
			<ResultTop :statusType="tradeInfo.status" :swapTime="useTime" />
			<TradingPair :tradingPair="tradeArray" />
			<div class="mt-30px">
				<Line v-if="tradeInfo.bridgeName" :label="$t('ChannelSelect')" :showIcon="false" class="mb-10px">
					<img :src="tradeInfo.appLogo" class="mr-6px h-22px rounded-full" />
					<span class="mr-20px">{{ tradeInfo.bridgeName }}</span>
				</Line>
				<Line v-else :label="$t('Platform')" :showIcon="false" class="mb-10px">
					<img :src="tradeInfo.appLogo" class="h-22px mr-19px" />
				</Line>
				<Line :label="$t('Price')" :showIcon="false" class="mb-10px">
					<p v-if="rateOrder">{{ rateArray[0][0] }} = {{ rateArray[0][1] }}</p>
					<p v-else>{{ rateArray[1][0] }} = {{ rateArray[1][1] }}</p>
					<img @click="changeRate" src="~~/assets/images/switchRate.png" class="w-16px ml-4px" />
				</Line>
				<Line :label="$t('TxFee')" :showIcon="false" class="mb-10px">
					<p class="pr-20px">{{ tradeInfo.fee }}</p>
				</Line>
				<Line :label="$t('CreatedTime')" :showIcon="false" class="mb-10px">
					<p class="pr-20px">{{ tradeInfo.createTime }}</p>
				</Line>
				<Line v-if="tradeInfo.completeTime" :label="$t('Updated')" :showIcon="false" class="mb-10px">
					<p class="pr-20px">{{ tradeInfo.completeTime || '--' }}</p>
				</Line>
				<Line :label="$t('OrderNo')" :showIcon="false" class="mb-10px">
					<p>{{ simplifyToken(tradeInfo.orderNo) }}</p>
					<img src="~~/assets/images/copyString.png" class="w-16px ml-4px" />
				</Line>
				<Line :label="$t('ReceivingAddress')" :showIcon="false" class="mb-10px">
					<p>{{ simplifyToken(tradeInfo.receiveAddress) }}</p>
					<img src="~~/assets/images/copyString.png" class="w-16px ml-4px" />
				</Line>
				<Line :label="$t('Hash')" :showIcon="false" class="mb-10px">
					<div class="h-21px flex flex-col items-end">
						<p class="mb-10px flex items-center">
							<img :src="`https://swap-jp.s3-accelerate.amazonaws.com/swapImg/${tradeInfo.payChain}Logo.png`" class="w-20px h-20px rounded-full mr-6px" />
							<span>{{ simplifyToken(tradeInfo.firstHash) }}</span>
							<img src="~~/assets/images/copyString.png" class="w-16px ml-4px" />
						</p>
						<p v-if="tradeInfo.secondHash" class="flex items-center">
							<img :src="`https://swap-jp.s3-accelerate.amazonaws.com/swapImg/${tradeInfo.receiveChain}Logo.png`" class="w-20px h-20px rounded-full mr-6px" />
							<span>{{ simplifyToken(tradeInfo.secondHash) }}</span>
							<img src="~~/assets/images/copyString.png" class="w-16px ml-4px" />
						</p>
					</div>
				</Line>
			</div>
			<div class="w-165px h-44px mt-36px fixed bottom-60px left-105px">
				<van-button class="w-165px h-44px ripple-btn overflow-hidden" round @click="tradeAgain" color="#597BF6">{{ $t("SwapAgain") }}</van-button>
			</div>
			<div @click="getScanHash" class="fixed bottom-20px w-375px left-0 flex justify-center items-center">
				<p class="text-[#597bf6] text-14px leading-20px mr-5px">{{ $t('ViewInBrowser') }}</p>
				<img src="~~/assets/images/rightArrow_detail.png" class="w-10px h-10px" />
			</div>
		</div>
		<div v-else class="h-100vh flex items-center justify-center">
			<Loading />
		</div>
		<van-popup v-model:show="showScanChoose" :transition-appear="true" duration="0.2" round position="bottom">
			<div class="h-277px">
				<div class="pt-15px px-16px pb-15px text-[#191e35] text-18px font-500 leading-25px border-style">{{$t('SelectBrowser')}}</div>
				<div class="h-60px py-14px px-16px flex items-center border-style" @click="browserScan(tradeInfo.payChain, tradeInfo.firstHash)">
					<Images :logo="`https://swap-jp.s3-accelerate.amazonaws.com/swapImg/${tradeInfo.payChain}Logo.png`" logoWidth="32px" :logoName="tradeInfo.payChain" :smallCoin="false" class="mr-10px flex-shrink-0" />
					<p class="text-[#191e35] leading-22px text-16px">{{ chainInfo[tradeInfo.payChain].fullName }}</p>
				</div>
				<div class="h-60px py-14px px-16px flex items-center border-b-8px border-solid border-[#f2f4f7]" @click="browserScan(tradeInfo.receiveChain, tradeInfo.secondHash)">
					<Images :logo="`https://swap-jp.s3-accelerate.amazonaws.com/swapImg/${tradeInfo.receiveChain}Logo.png`" logoWidth="32px" :logoName="tradeInfo.payChain" :smallCoin="false" class="mr-10px flex-shrink-0" />
					<p class="text-[#191e35] leading-22px text-16px">{{ chainInfo[tradeInfo.receiveChain].fullName }}</p>
				</div>
				<div class="py-19px text-center text-16px leading22px" @click="closePropUp">{{ $t('Cancel') }}</div>
			</div>
		</van-popup>
	</div>
</template>

<script setup>
import ResultTop from "../modules/resultPage/ResultTop.vue";
import TradingPair from "~~/components/TradingPair.vue";
import Line from "~~/components/Line.vue";
import { getStringNum, simplifyToken, getShowTime } from "~~/helper/common";
import BigNumber from "bignumber.js";
import useBaseApi from "~~/api/useBaseApi";
import { chainInfo } from "~~/helper/chainInfo";
import { postMessageApp } from "~~/helper/postMessage";
import useGlobalData from "~~/store/useGlobalData";

onBeforeRouteUpdate((to, from) => {
	const globalData = useGlobalData();
	const title = globalData.language == "zh" ? "交易结果" : "Swap Results";
	document.title = title;
	postMessageApp(
		"setTitle",
		JSON.stringify({
			title,
		})
	);
});

let timer = null;

const tradeArray = ref([]);
const tradeInfo = ref({});
const useTime = ref("");

const getPageDetail = (orderNo) => {
	const baseApi = useBaseApi();
	timer = setInterval(() => {
		baseApi.get(({ api }) => {
			return {
				api: api.getDetailByOrderNo,
				params: { orderNo },
				success: async (res) => {
					tradeArray.value = [
						{
							type: "pay",
							logo: res.token0_logo,
							symbol: res.symbol0,
							chain: res.token0_chain,
							token: res.token0,
							decimals: res.decimals0,
							amount: getStringNum(
								BigNumber(res.amount0).shiftedBy(
									-res.decimals0
								),
								res.decimals0 > 8 ? 8 : res.decimals0
							),
						},
						{
							type: "receive",
							logo: res.token1_logo,
							symbol: res.symbol1,
							chain: res.token1_chain,
							token: res.token1,
							decimals: res.decimals1,
							amount: getStringNum(
								BigNumber(res.amount1).shiftedBy(
									-res.decimals1
								),
								res.decimals1 > 8 ? 8 : res.decimals1
							),
						},
					];
					tradeInfo.value = {
						status: res.status,
						bridgeName: res.bridge_name,
						appLogo: res.appLogo,
						fee: res.fee * 100 + "%",
						createTime: res.create_time,
						completeTime: res.complete_time,
						orderNo: res.order_no,
						receiveAddress: res.to,
						firstHash: res.hash,
						secondHash: res?.bridge_receive_hash,
						payChain: res.token0_chain,
						receiveChain: res.token1_chain,
					};
					getRate(res);
					// tradeAgain(res);
					if (res.status != "proccessing") {
						useTime.value = res.pre_time;
						clearInterval(timer);
					} else {
						useTime.value = getShowTime(
							new Date(res.complete_time) -
								new Date(res.create_time)
						);
					}
					console.log(useTime.value);
				},
				fail: (err) => {},
			};
		});
	}, 5000);
};

const rateOrder = ref(true);
const rateArray = ref([]);
const getRate = (data) => {
	rateArray.value = [
		[
			`1 ${data.symbol0}`,
			`${
				getStringNum(
					tradeArray.value[1].amount / tradeArray.value[0].amount,
					8
				) +
				" " +
				data.symbol1
			}`,
		],
		[
			`1 ${data.symbol1}`,
			`${
				getStringNum(
					tradeArray.value[0].amount / tradeArray.value[1].amount,
					8
				) +
				" " +
				data.symbol0
			}`,
		],
	];
};
const changeRate = () => {
	rateOrder.value = !rateOrder.value;
};

const { replaceTradingPair } = useNuxtApp().$managerScheduler;
const tradeAgain = () => {
	const router = useRouter();
	replaceTradingPair(tradeArray.value);
	router.push("/");
};

const showScanChoose = ref(false);
const getScanHash = () => {
	if (tradeInfo.value.secondHash) {
		showScanChoose.value = true;
	} else {
		browserScan(tradeInfo.value.payChain, tradeInfo.value.firstHash);
	}
};
const closePropUp = () => {
	showScanChoose.value = false;
};
const browserScan = (chain, hash) => {
	console.log(chainInfo);
	postMessageApp(
		"setTitle",
		JSON.stringify({
			title: "",
		})
	);
	const url = chainInfo[chain].scanAddress + hash;
	// window.open(url);
	postMessageApp("openWebview", url);
};

onMounted(() => {
	const route = useRoute();
	getPageDetail(route.query.orderNo);
});
</script>

<style lang="scss" scoped>
.border-style {
	border-bottom: calc(0.5px);
	border-color: #e6eaf5;
	border-style: solid;
}
</style>