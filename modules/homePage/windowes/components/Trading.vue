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
import { simplifyToken } from "~~/helper/common";
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
		};
	},
	watch: {
		localHash: {
			handler(val) {
				if (val) {
					this.preHash = "dones";
					setTimeout(() => {
						this.postHash = "loading";
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
	mounted() {
		// setTimeout(() => {
		// 	this.preHash = "dones";
		// 	setTimeout(() => {
		// 		this.postHash = "loading";
		// 		setTimeout(() => {
		// 			this.postHash = "dones";
		// 			setTimeout(() => {
		// 				this.waitingResult = "loading";
		// 				setTimeout(() => {
		// 					this.waitingResult = "success";
		// 				}, 3000);
		// 			}, 1000);
		// 		}, 3000);
		// 	}, 1000);
		// }, 3000);
	},
	methods: {
		backHome() {
			this.$emit("closeBox");
		},
	},
};
</script>

<style lang="scss" scoped>
</style>