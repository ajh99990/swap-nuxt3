<template>
	<div>
		<p class="text-[#7e84a3] text-14px leading-20px mb-12px">通道选择</p>
		<div class="bg-[#f7f9fe] rounded-6px h-120px w-343px">
			<div class="bg-[#ecf0ff] rounded-t-6px w-343px h-38px px-12px py-9px flex items-center">
				<img :src="transactionDetails.routeLogo" class="rounded-full mr-6px w-20px" />
				<span class="text-[#191e35] font-500 text-14px leading-20px">Multichain</span>
			</div>
			<div class="p-12px pr-0">
				<Line :label="$t('GasFee')" :showIcon="false" class="mb-14px">
					<span class="pr-19px">~ ${{ transactionDetails.GasFee }}</span>
				</Line>
				<Line :label="$t('swapTime')" :showIcon="false">
					<span class="pr-19px">~ {{ transactionDetails.swapTime }}</span>
				</Line>
			</div>
		</div>
		<div class="w-165px h-44px mt-36px fixed bottom-50px left-90px">
			<van-button class="w-165px h-44px ripple-btn overflow-hidden" round @click="toTransaction" color="#597BF6">确认兑换</van-button>
		</div>
	</div>
</template>

<script setup>
import {
	getCrossAllowance,
	approveCrossBridge,
	crossTransactions,
} from "../common";

const transactionDetails = computed(() => {
	return useNuxtApp().$managerScheduler.transactionDetails.value;
});
const originalData = computed(() => {
	return useNuxtApp().$managerScheduler.originalData.value;
});

const payCoin = computed(() => {
	const tradingPair = useNuxtApp().$managerScheduler.tradingPair.value;
	return tradingPair.filter((item) => item.type == "pay")[0];
});

const allowance = ref(0);
const isMainCost = ref(false);
const estimateGasLoading = ref(true);

const toTransaction = async () => {
	if (!isMainCost.value && allowance.value == 0) {
		await approveCrossBridge(originalData.value);
	}
	const hash = await crossTransactions(originalData.value);
	console.log(hash);
};

onMounted(async () => {
	console.log(originalData.value);
	isMainCost.value = payCoin.value.token == "0x000";
	//先判断授权额度
	if (!isMainCost.value) {
		console.log("enter gat allowance");
		allowance.value = await getCrossAllowance(originalData.value);
	}
	estimateGasLoading.value = false;
	console.log(allowance.value);
});
</script>

<style lang="scss" scoped>
</style>