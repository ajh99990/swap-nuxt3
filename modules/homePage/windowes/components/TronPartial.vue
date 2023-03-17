<template>
	<div>
		<p class="text-[#7e84a3] text-14px leading-20px mb-12px">{{ $t($t('EstGasfee')) }}</p>
		<div class="bg-[#f5f6fa] rounded-12px h-74px w-345px p-15px">
			<div class="border-1px border-solid border-[#597bf6] bg-[#ffffff] w-315px h-44px rounded-8px text-[#597bf6] p-15px flex justify-between items-center font-500 text-12px leading-14px">
				<p>
					<span>
						{{ BigNumber(gasPrice * gasLimit + 1)
						.shiftedBy(-6)
						.toNumber() }}
					</span>
					<span>&nbsp;TRX</span>
				</p>
				<p>{{ $t('EstTimes',{val:1}) }}</p>
			</div>
		</div>
		<div class="w-165px h-44px mt-36px fixed bottom-50px left-90px">
			<van-button class="w-165px h-44px ripple-btn overflow-hidden" :loading="estimateGasLoading || buttonLoading" round @click="toTransaction" color="#597BF6">{{ $t('swapConfirm') }}</van-button>
		</div>
	</div>
</template>

<script setup>
import BigNumber from "bignumber.js";
import {
	getEstimateGas,
	getAllowance,
	toApprove,
	transactions,
} from "../common";
import { getTronGasPrice } from "~~/helper/tron/index";
import { showSomeingError } from "~~/helper/common";

const props = defineProps({
	payCoin: Object,
});

const originalData = computed(() => {
	return useNuxtApp().$managerScheduler.originalData.value;
});

const isMainCost = ref(false);
const allowance = ref(0);
const gasPrice = ref(0);
const gasLimit = ref(0);
const estimateGasLoading = ref(true);

const operateType = computed(() => {
	return useNuxtApp().$managerScheduler.operateType.value;
});

const emits = defineEmits(["overdoing"]);
const buttonLoading = ref(false);
const toTransaction = async () => {
	buttonLoading.value = true;
	try {
		if (!isMainCost.value && allowance.value == 0) {
			await toApprove(
				props.payCoin.chain,
				props.payCoin.token,
				originalData.value.contractAddress,
				false
			);
			gasLimit.value = await getEstimateGas(
				props.payCoin.chain,
				originalData.value,
				operateType
			);
		}
		const hash = await transactions(
			props.payCoin.chain,
			props.payCoin.token,
			gasPrice.value,
			gasLimit.value
		);
		console.log(hash);
		emits("overdoing", hash);
	} catch (error) {
		showSomeingError();
		buttonLoading.value = false;
	}
};
const { addSwapTime } = useNuxtApp().$managerScheduler;
onMounted(async () => {
	gasPrice.value = await getTronGasPrice();

	//判断是否是主币
	isMainCost.value = props.payCoin.token == "0x000";

	//判断已授权的额度
	if (!isMainCost.value) {
		allowance.value = await getAllowance(
			props.payCoin.chain,
			props.payCoin.token,
			originalData.value.contractAddress
		);
	}

	//获取当前的gasLimit
	if (allowance.value == 0 && !isMainCost.value) {
		//未授权
		gasLimit.value = await toApprove(
			props.payCoin.chain,
			props.payCoin.token,
			originalData.value.contractAddress,
			true
		);
	} else {
		//主币或已授权
		gasLimit.value = await getEstimateGas(
			props.payCoin.chain,
			originalData.value,
			operateType
		);
	}
	addSwapTime("1");
	estimateGasLoading.value = false;
});
</script>

<style lang="scss" scoped>
</style>