<template>
	<div class="mt-30px px-15px">
		<p class="text-[#191e35] font-500 text-20px leading-28px text-center w-345px mb-21px">订单提交中</p>
		<div class="relative">
			<div class="flex justify-between">
				<div class="ml-5px flex flex-col justify-center items-center z-20">
					<img src="~~/assets/images/submitOrder.png" class="w-55px" />
					<span class="text-[#7e84a3] text-12px leading-17px">订单已提交</span>
				</div>
				<div class="mr-5px flex flex-col justify-center items-center z-20">
					<img src="~~/assets/images/trading.png" class="w-55px" />
					<span class="text-[#7e84a3] text-12px leading-17px">订单已提交</span>
				</div>
				<div class="mr-5px flex flex-col justify-center items-center z-20">
					<img src="~~/assets/images/submitResult.png" class="w-55px" />
					<span class="text-[#7e84a3] text-12px leading-17px">订单已提交</span>
				</div>
			</div>
			<div class="absolute left-40px top-20px w-120px h-9px">
				<div class="w-120px h-9px absolute top-0 z-12" ref="progressTarget1"></div>
				<div class="w-120px h-9px absolute top-0 z-13" ref="doneTarget1"></div>
				<div class="w-120px h-9px absolute top-0 bg-[#f5f6fa] mt-3px z-11"></div>
			</div>
			<div class="absolute right-40px top-20px w-120px h-9px">
				<div class="w-120px h-9px absolute top-0 z-12" ref="progressTarget2"></div>
				<div class="w-120px h-9px absolute top-0 z-13" ref="doneTarget2"></div>
				<div class="w-120px h-9px absolute top-0 bg-[#f5f6fa] mt-3px z-11"></div>
			</div>
		</div>
	</div>
</template>

<script >
import lottie from "lottie-web";
import progress from "~~/public/jsonImg/progress/data.json";
import done from "~~/public/jsonImg/done/data.json";
export default {
	mounted() {
		lottie.loadAnimation({
			container: this.$refs.progressTarget1,
			renderer: "svg",
			loop: true,
			autoplay: true,
			animationData: progress,
		});
		lottie.loadAnimation({
			container: this.$refs.progressTarget2,
			renderer: "svg",
			loop: true,
			autoplay: true,
			animationData: progress,
		});
		lottie.loadAnimation({
			container: this.$refs.doneTarget1,
			renderer: "svg",
			loop: true,
			autoplay: true,
			animationData: done,
		});
		lottie.loadAnimation({
			container: this.$refs.doneTarget2,
			renderer: "svg",
			loop: true,
			autoplay: true,
			animationData: done,
		});
	},
};
</script>

<style lang="scss" scoped>
</style>