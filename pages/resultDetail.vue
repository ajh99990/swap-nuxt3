<template>
	<div class="h-100vh px-15px">
		<div v-if="tradeInfo.status">
			<div class="flex flex-col items-center justify-center mt-30px mb-32px">
				<img src="~~/assets/images/successState.png" class="w-50px" />
				<p class="text-[#191e35] font-500 text-18px leading-25px mt-8px">兑换成功</p>
				<p class="text-[#7e84a3] text-12px leading-12px mt-6px">用时2分钟</p>
			</div>
			<TradingPair :tradingPair="tradeArray" />
			<div>
				<Line v-if="tradeInfo.bridgeName" label="通道选择" :showIcon="false" class="mb-10px mt-30px">
					<img :src="tradeInfo.appLogo" class="mr-6px h-22px rounded-full" />
					<span class="mr-20px">{{ tradeInfo.bridgeName }}</span>
				</Line>
				<!-- <Line v-else :label="$t('bestChannel')" :showIcon="false" class="mb-10px">
			<img :src="detailInfo.platform" class="h-22px mr-19px" />
				</Line>-->
				<Line label="价格" :showIcon="false" class="mb-10px">
					<p v-if="rateOrder">{{ rateArray[0][0] }} = {{ rateArray[0][1] }}</p>
					<p v-else>{{ rateArray[1][0] }} = {{ rateArray[1][1] }}</p>
					<img @click="changeRate" src="~~/assets/images/switchRate.png" class="w-16px ml-4px" />
				</Line>
				<Line label="手续费" :showIcon="false" class="mb-10px">
					<p class="pr-20px">{{ tradeInfo.fee }}</p>
				</Line>
				<Line label="创建时间" :showIcon="false" class="mb-10px">
					<p class="pr-20px">{{ tradeInfo.createTime }}</p>
				</Line>
				<Line label="完成时间" :showIcon="false" class="mb-10px">
					<p class="pr-20px">{{ tradeInfo.completeTime }}</p>
				</Line>
				<Line label="订单编号" :showIcon="false" class="mb-10px">
					<p>{{ simplifyToken(tradeInfo.orderNo) }}</p>
					<img src="~~/assets/images/copyString.png" class="w-16px ml-4px" />
				</Line>
				<Line label="收款地址" :showIcon="false" class="mb-10px">
					<p>{{ simplifyToken(tradeInfo.receiveAddress) }}</p>
					<img src="~~/assets/images/copyString.png" class="w-16px ml-4px" />
				</Line>
				<Line label="交易哈希" :showIcon="false" class="mb-10px">
					<div class="h-21px flex flex-col items-end">
						<p class="mb-10px">
							<img src alt />
							<span>{{ simplifyToken(tradeInfo.firstHash) }}</span>
							<img src="~~/assets/images/copyString.png" class="w-16px ml-4px" />
						</p>
						<p>
							<img src alt />
							<span>{{ simplifyToken(tradeInfo.secondHash) }}</span>
							<img src="~~/assets/images/copyString.png" class="w-16px ml-4px" />
						</p>
					</div>
				</Line>
			</div>
			<div class="w-165px h-44px mt-36px fixed bottom-60px left-105px">
				<van-button class="w-165px h-44px ripple-btn overflow-hidden" round @click="tradeAgain" color="#597BF6">再次交易</van-button>
			</div>
			<div @click="getScanHash" class="fixed bottom-20px w-375px left-0 flex justify-center items-center">
				<p class="text-[#597bf6] text-14px leading-20px mr-5px">前往第三方网站查看交易详情</p>
				<img src="~~/assets/images/rightArrow_detail.png" class="w-10px h-10px" />
			</div>
		</div>
		<div v-else class="h-100vh flex items-center justify-center">
			<Loading />
		</div>
		<van-popup v-model:show="showScanChoose" :transition-appear="true" duration="0.2" round position="bottom">
			<div class="h-277px">
				<div class="pt-15px px-16px pb-15px text-[#191e35] text-18px font-500 leading-25px border-style">选择区块链浏览器</div>
				<div class="h-60px py-14px px-16px flex items-center border-style" @click="browserScan(tradeInfo.payChain, tradeInfo.firstHash)">
					<Images :logo="`https://swap-jp.s3-accelerate.amazonaws.com/chain/${tradeInfo.payChain}_l.png`" logoWidth="32px" :logoName="tradeInfo.payChain" :smallCoin="false" class="mr-10px flex-shrink-0" />
					<p class="text-[#191e35] leading-22px text-16px">{{ chainInfo[tradeInfo.payChain].fullName }}</p>
				</div>
				<div class="h-60px py-14px px-16px flex items-center border-b-8px border-solid border-[#f2f4f7]" @click="browserScan(tradeInfo.receiveChain, tradeInfo.secondHash)">
					<Images :logo="`https://swap-jp.s3-accelerate.amazonaws.com/chain/${tradeInfo.receiveChain}_l.png`" logoWidth="32px" :logoName="tradeInfo.payChain" :smallCoin="false" class="mr-10px flex-shrink-0" />
					<p class="text-[#191e35] leading-22px text-16px">{{ chainInfo[tradeInfo.receiveChain].fullName }}</p>
				</div>
				<div class="py-19px text-center text-16px leading22px" @click="closePropUp">取消</div>
			</div>
		</van-popup>
	</div>
</template>

<script setup>
import TradingPair from "~~/components/TradingPair.vue";
import Line from "~~/components/Line.vue";
import { getStringNum, simplifyToken } from "~~/helper/common";
import BigNumber from "bignumber.js";
import useBaseApi from "~~/api/useBaseApi";
import { chainInfo } from "~~/helper/chainInfo";
import { postMessageApp } from "~~/helper/postMessage";

let timer = null;

const tradeArray = ref([]);
const tradeInfo = ref({});

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
					tradeAgain(res);
					console.log(tradeInfo.value);
					clearInterval(timer);
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
	console.log(rateArray.value);
};
const changeRate = () => {
	rateOrder.value = !rateOrder.value;
};

const { replaceTradingPair } = useNuxtApp().$managerScheduler;
const tradeAgain = (res) => {
	let tradingPair = [
		{
			type: "pay",
			chain: res.token0_chain,
			symbol: res.token0_chain,
			token: res.token0_chain,
			decimals: res.token0_chain,
			logo: res.token0_chain,
			amount: "",
		},
		{
			type: "receive",
			chain: res.token0_chain,
			symbol: res.token0_chain,
			token: res.token0_chain,
			decimals: res.token0_chain,
			logo: res.token0_chain,
			amount: "",
		},
	];
	replaceTradingPair(tradingPair);
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
	const url = chainInfo[chain] + hash;
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