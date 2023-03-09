<template>
	<div class="w-345px h-82px bg-[#f5f6fa] rounded-16px p-15px relative">
		<div class="flex items-center justify-between z-10 mb-12px">
			<p class="flex items-center w-157.5px">
				<img :src="payCoin.logo" class="w-20px rounded-full mr-8px" />
				<span class="text-[#191e35] text-16px leading-14px mr-8px">{{ payCoin.symbol }}</span>
				<span class="text-[#7e84a3] text-9px leading-11px h-13px border-solid border-0.5px border-[#7e84a3] rounded-full px-5px">{{ chainInfo[payCoin.chain].fullName }}</span>
			</p>
			<p class="w-157.5px text-[#191e35] font-500 text-16px leading-14px text-right">{{ payCoin.amount }}</p>
		</div>
		<div class="flex items-center justify-between z-10">
			<p class="flex items-center w-157.5px">
				<img :src="receiveCoin.logo" class="w-20px rounded-full mr-8px" />
				<span class="text-[#191e35] text-16px leading-14px mr-8px">{{ receiveCoin.symbol }}</span>
				<span class="text-[#7e84a3] text-9px leading-11px h-13px border-solid border-0.5px border-[#7e84a3] rounded-full px-5px">{{ chainInfo[receiveCoin.chain].fullName }}</span>
			</p>
			<p class="w-157.5px text-[#191e35] font-500 text-16px leading-14px text-right">{{ receiveCoin.amount }}</p>
		</div>
		<div class="absolute left-24.5px top-34px w-1px h-16px bg-[#bfc5d6]"></div>
	</div>
</template>

<script setup>
import { chainInfo } from "~~/helper/chainInfo";
const props = defineProps({
	tradingPair: Array,
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