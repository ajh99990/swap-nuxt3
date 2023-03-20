<template>
	<div>
		<div class="flex flex-col items-center justify-center mt-30px mb-32px">
			<div v-if="statusType == 'proccessing'" ref="jumpCoinTarget" class="w-60px mb-3px"></div>
			<img v-if="statusType == 'trade_success'" src="~~/assets/images/successState.png" class="w-50px" />
			<img v-if="statusType == 'trade_fail'" src="~~/assets/images/failState.png" class="w-50px" />
			<p class="text-[#191e35] font-500 text-18px leading-25px mt-8px">{{ statusStr }}</p>
			<p class="text-[#7e84a3] text-12px leading-12px mt-6px">{{ swapTimeStr }}</p>
		</div>
	</div>
</template>

<script >
import lottie from "lottie-web";
import jumpCoin from "~~/public/jsonImg/jumpCoin/data.json";
export default {
	props: {
		statusType: {
			type: String,
			default: "",
		},
		swapTime: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			statusStr: "",
			swapTimeStr: "",
		};
	},
	watch: {
		statusType: {
			handler(val) {
				console.log(val, this.swapTime);
				if (val === "proccessing") {
					this.$nextTick(() => {
						lottie.loadAnimation({
							container: this.$refs.jumpCoinTarget,
							renderer: "svg",
							loop: true,
							autoplay: true,
							animationData: jumpCoin,
						});
					});
					this.statusStr = this.$t("InProgress");
					this.swapTimeStr = this.$t("EstTimes", {
						val: this.swapTime,
					});
				}
				if (val === "trade_success") {
					this.statusStr = this.$t("Success");
					this.swapTimeStr = this.$t("EstTimes", {
						val: this.swapTime,
					});
				}
				if (val === "trade_fail") {
					this.statusStr = this.$t("Failed");
					this.swapTimeStr = this.$t("EstTimes", {
						val: this.swapTime,
					});
				}
			},
			immediate: true,
		},
	},
};
</script>