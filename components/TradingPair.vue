<template>
	<div class="w-345px h-82px rounded-16px p-15px relative" :class=" !showImg ? 'bg-[#f5f6fa]' : 'bg-[#FFF]'">
		<div class="flex items-center justify-between z-10 mb-12px">
			<p class="flex items-center w-157.5px">
				<Images :logo="payCoin.logo" logoWidth="20px" :logoName="payCoin.symbol" :smallCoin="true" class="mr-8px flex-shrink-0" />
				<span class="text-[#191e35] text-16px leading-14px mr-8px">{{ payCoin.symbol }}</span>
				<span class="text-[#7e84a3] text-9px leading-11px h-13px border-solid border-0.5px border-[#7e84a3] rounded-full px-5px">{{ chainInfo[payCoin.chain].fullName }}</span>
			</p>
			<p class="w-157.5px text-[#191e35] font-500 text-16px leading-14px text-right">{{ payCoin.amount }}</p>
		</div>
		<div class="flex items-center justify-between z-10">
			<p class="flex items-center w-157.5px">
				<Images :logo="receiveCoin.logo" logoWidth="20px" :logoName="receiveCoin.symbol" :smallCoin="true" class="mr-8px flex-shrink-0" />
				<span class="text-[#191e35] text-16px leading-14px mr-8px">{{ receiveCoin.symbol }}</span>
				<span class="text-[#7e84a3] text-9px leading-11px h-13px border-solid border-0.5px border-[#7e84a3] rounded-full px-5px">{{ chainInfo[receiveCoin.chain].fullName }}</span>
			</p>
			<p class="w-157.5px text-[#191e35] font-500 text-16px leading-14px text-right">{{ receiveCoin.amount }}</p>
		</div>
		<img v-if="showImg" src="~~/assets/images/tradeTo.png" class="absolute left-18px top-34px w-12px" />
		<div v-else class="absolute left-24.5px top-34px w-1px h-16px bg-[#bfc5d6]"></div>
	</div>
</template>

<script setup>
import { chainInfo } from "~~/helper/chainInfo";
const props = defineProps({
	tradingPair: Array,
	showImg: {
		type: Boolean,
		default: false,
	},
});
const payCoin = computed(() => {
	return props.tradingPair?.filter((item) => item.type == "pay")[0];
});
const receiveCoin = computed(() => {
	return props.tradingPair?.filter((item) => item.type == "receive")[0];
});

// onMounted(() => {
// 	console.log("payCoin", payCoin);
// 	console.log("receiveCoin", receiveCoin);
// });
</script>

<style scoped>
</style>