<template>
	<div class="mt-30px px-15px">
		<p class="text-[#191e35] font-500 text-20px leading-28px text-center w-345px mb-21px">订单提交中</p>
		<div class="relative mb-42px">
			<div class="flex justify-between">
				<div class="ml-5px flex flex-col justify-center items-center z-20">
					<img src="~~/assets/images/submitOrder.png" class="w-55px" />
					<span class="text-[#7e84a3] text-12px leading-17px">订单已提交</span>
				</div>
				<div class="mr-5px flex flex-col justify-center items-center z-20">
					<img v-if="postHash == 'loading' || postHash == 'dones'" src="~~/assets/images/tradingDone.png" class="w-55px" />
					<img v-else src="~~/assets/images/trading.png" class="w-55px" />
					<span class="text-[#7e84a3] text-12px leading-17px">订单已提交</span>
				</div>
				<div class="mr-5px flex flex-col justify-center items-center z-20">
					<img v-if="waitingResult == ''" src="~~/assets/images/submitResult.png" class="w-55px" />
					<div v-if="waitingResult == 'loading'" ref="jumpCoinTarget" class="w-50px mb-3px"></div>
					<img v-if="waitingResult == 'success'" src="~~/assets/images/submitSuccess.png" class="w-55px transform duration-150 scale-100" />
					<img v-if="waitingResult == 'fail'" src="~~/assets/images/submitFail.png" class="w-55px" />
					<span class="text-[#7e84a3] text-12px leading-17px">订单已提交</span>
				</div>
			</div>
			<div class="absolute left-40px top-20px w-120px h-9px">
				<ProgressImg :showType="preHash" />
			</div>
			<div class="absolute right-40px top-20px w-120px h-9px">
				<ProgressImg :showType="postHash" />
			</div>
		</div>
		<TradingPair :tradingPair="tradingPair"></TradingPair>
		<div class="h-1px bg-[#e6eaf5] my-18px"></div>
		<div class="mb-35px">
			<Line label="价格" :showIcon="false" class="mb-10px">
				<ExchangeRate :showImg="false" />
			</Line>
			<Line label="预计完成时间" :showIcon="false" class="mb-10px">
				<span class="mr-5px font-500">{{ detailInfo.swapTime }}</span>
			</Line>
			<Line label="收款地址" :showIcon="false" class="mb-10px">
				<span class="mr-5px font-500">{{ receiveAddress }}</span>
			</Line>
		</div>
		<div class="flex justify-between overflow-hidden">
			<van-button class="w-165px h-44px ripple-btn mr-15px" round @click="backHome">返回首页</van-button>
			<van-button class="w-165px h-44px ripple-btn" round color="#597BF6">查看详情</van-button>
		</div>
	</div>
</template>

<script >
import ProgressImg from "./ProgressImg.vue";
import ExchangeRate from "../../ExchangeRate.vue";
import Line from "~~/components/Line.vue";
import lottie from "lottie-web";
import jumpCoin from "~~/public/jsonImg/jumpCoin/data.json";
import { getStringNum, simplifyToken } from "~~/helper/common";
import useBaseApi from "~~/api/useBaseApi";
import useGlobalData from "~~/store/useGlobalData";
import { getSubmitAmount, getCrossData } from "../common";
import BigNumber from "bignumber.js";
export default {
	components: { ProgressImg, Line, ExchangeRate },
	props: {
		localHash: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			preHash: "loading",
			postHash: "none",
			waitingResult: "",
			timer: null,
		};
	},
	watch: {
		localHash: {
			handler(val) {
				if (val) {
					this.preHash = "dones";
					setTimeout(() => {
						this.postHash = "loading";
						this.waitingResult = "loading";
						this.submitHash(val);
					}, 1000);
				}
			},
		},
		waitingResult: {
			handler(val) {
				if (val == "loading") {
					this.$nextTick(() => {
						lottie.loadAnimation({
							container: this.$refs.jumpCoinTarget,
							renderer: "svg",
							loop: true,
							autoplay: true,
							animationData: jumpCoin,
						});
					});
				}
			},
		},
	},
	computed: {
		tradingPair() {
			return useNuxtApp().$managerScheduler.tradingPair.value;
		},
		detailInfo() {
			console.log(
				useNuxtApp().$managerScheduler.transactionDetails.value
			);
			return useNuxtApp().$managerScheduler.transactionDetails.value;
		},
		receiveAddress() {
			return simplifyToken(
				useNuxtApp().$managerScheduler.receiveAddress.value
			);
		},
	},
	methods: {
		backHome() {
			this.$emit("closeBox");
		},
		async submitHash(hash) {
			console.log(hash, "submit");
			const globalData = useGlobalData();

			const tradingPair =
				useNuxtApp().$managerScheduler.tradingPair.value;
			const payCoin = tradingPair.filter((item) => item.type == "pay")[0];
			const receiveCoin = tradingPair.filter(
				(item) => item.type == "receive"
			)[0];

			//当前之判断波场和evm
			const fromAddress =
				payCoin.chain == "tron"
					? globalData.ownerTronAddress
					: globalData.ownerAddress;
			const receiveAddress =
				useNuxtApp().$managerScheduler.receiveAddress.value;
			const slippage = useNuxtApp().$managerScheduler.slippage.value;

			const originalData =
				useNuxtApp().$managerScheduler.originalData.value;
			const transactionDetails =
				useNuxtApp().$managerScheduler.transactionDetails.value;

			console.log(originalData, transactionDetails);

			const crossChain = payCoin.chain != receiveCoin.chain;

			const amountObject = getSubmitAmount(crossChain, originalData);
			console.log("amountObject", amountObject);
			let params = {
				hash: hash,
				from: fromAddress,
				to: receiveAddress,
				address: fromAddress,
				token0: payCoin.token,
				token1: receiveCoin.token,
				token0_chain: payCoin.chain,
				token1_chain: receiveCoin.chain,

				name: crossChain ? originalData.bridgeMark : originalData.name,
				amount0: amountObject.payAmount,
				amount1: amountObject.receiveAmount,

				pre_time: Number(transactionDetails.swapTime),
			};

			const baseApi = useBaseApi();
			if (crossChain) {
				const Str = `${payCoin.chain}_${payCoin.token}`;
				const payToUsdt = await baseApi.post(({ api }) => {
					return {
						api: api.getCoinPrice,
						data: [Str],
					};
				});
				const crossData = await getCrossData(originalData, receiveCoin);
				const crossParams = {
					fee: crossData.fee,
					fee_usdt: crossData.feeUsdt,
					fee_token: crossData.feeToken,
					bridge_key: crossData.bridgeKey,

					token0_usdt: getStringNum(
						BigNumber(payToUsdt[Str]).times(payCoin.amount),
						2
					),
					bridge_type: originalData.bridgeMark,
					channel_fee_usdt: 0,
					slippage: slippage,
					bridge_order_id: hash,
				};
				params = Object.assign(params, crossParams);
			}

			baseApi.post(({ api }) => {
				return {
					api: api.submitHash,
					data: params,
					success: async (res) => {
						this.getResultState(res);
					},
					fail: (err) => {
						this.submitHash(hash);
					},
				};
			});
		},
		getResultState(orderNo) {
			const baseApi = useBaseApi();
			this.timer = setInterval(() => {
				baseApi.get(({ api }) => {
					return {
						api: api.getDetailByOrderNo,
						params: { orderNo },
						success: async (res) => {
							if (res.status == "trade_success") {
								this.postHash = "dones";
								clearInterval(this.timer);
								setTimeout(() => {
									this.waitingResult = "success";
								}, 1000);
							} else if (res.status == "trade_fail") {
								this.postHash = "dones";
								clearInterval(this.timer);
								setTimeout(() => {
									this.waitingResult = "fail";
								}, 1000);
							}
						},
						fail: (err) => {
							console.log(err);
						},
					};
				});
			}, 5000);
		},
	},
	unmounted() {
		clearInterval(this.timer);
	},
};
</script>

<style lang="scss" scoped>
</style>