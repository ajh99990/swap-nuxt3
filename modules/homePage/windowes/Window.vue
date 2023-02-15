<template>
	<div v-if="coinData" class="w-343px h-166px bg-[#F2F5FE] px-12px window" :class="
      coinData.type == 'pay'
        ? 'rounded-t-12px pt-12px pb-20px'
        : 'rounded-b-12px pt-20px pb-12px'
    ">
		<div @click="switchCoin(coinData.chain, coinData.type)" class="flex justify-between items-center w-319px h-46px bg-[#F7FAFF] px-8px rounded-8px">
			<p class="text-size-14px text-[#191E35] leading-22px font-500">{{ coinData.type == "pay" ? $t("windowSell") : $t("windowBuy") }}</p>
			<div class="relative flex">
				<Images :logo="coinData.logo" logoWidth="30px" :specialStyle="true" :logoName="coinData.symbol.toLocaleUpperCase()" :smallCoin="false" class="mr-8px flex-shrink-0" />
				<span class="flex flex-col">
					<span :class="coinData.symbol.length > 4 ? 'text-14px' : 'text-16px'" class="font-400 truncate max-w-120px overflow-hidden pr-30px">{{ coinData.symbol.toLocaleUpperCase() }}</span>
					<span :class="
              chainInfo[coinData.chain].fullName.length > 4
                ? 'text-11px'
                : 'text-14px'
            " class="h-13px text-minor mt-3px truncate max-w-120px overflow-hidden">{{ chainInfo[coinData.chain].fullName }}</span>
				</span>
				<img src="@/assets/images/windowSelect.png" class="absolute top-6px right-5px w-10px h-6px" />
			</div>
		</div>
		<div class="flex items-center justify-between w-303px h-48px pb-1px m-auto border-b-1px border-solid border-[#DBE0EE]">
			<van-field :class="'fieldStyle' + coinData.type" class="fieldStyle" v-model="coinData.amount" clearable @clear="clearField" :formatter="formatter" @input="inputValue" type="number" />
		</div>
		<div class="relative top-8px flex justify-between">
			<p class="text-size-14px flex text-[#909ab5] px-8px">
				<span>$ {{ coinBalance }}</span>
			</p>
			<p class="text-size-14px flex text-[#909ab5]">
				<span class="text-minor font-400">{{ $t("windowBalance") }}</span>
				<span class="text-minor font-400 pl-4px pr-8px">{{ totalAmount }}</span>
				<span v-if="coinData.type == 'pay'" class="pr-8px text-primary font-500 text-[#597bf6]" @click="allIn">{{ $t("windowMax") }}</span>
			</p>
		</div>
	</div>
</template>

<script setup>
import { chainInfo } from "@/helper/chainInfo";
import useJudgeFun from "../switchChain/judgeFun";
import { getStringNum } from "~~/helper/common";
import useBaseApi from "~~/api/useBaseApi";

const baseApi = useBaseApi();
const props = defineProps({
	coinData: Object,
});

const coinBalance = ref("0.00");
watchEffect(async () => {
	if (Number(props.coinData.amount)) {
		let Str = `${props.coinData.chain}_${props.coinData.token}`;
		const usdtReta = await baseApi.post(({ api }) => {
			return {
				api: api.getCoinPrice,
				onlySend: true,
				data: [Str],
			};
		});
		const number = getStringNum(
			Number(props.coinData.amount) * usdtReta[Str],
			2
		);
		coinBalance.value = number == "NaN" ? "--" : number;
	} else {
		coinBalance.value = "0.00";
	}
});

const totalAmount = ref("0.00");
watchEffect(async () => {
	totalAmount.value = getStringNum(
		await useJudgeFun(props.coinData.chain, props.coinData.token)
	);
});

const emits = defineEmits(["showCoinList", "getInputValue"]);
const switchCoin = (chain, windowType) => {
	emits("showCoinList", chain, windowType);
};

const allIn = () => {
	// coinData.value.amount = totalAmount.value;
};
const formatter = (value) => {
	if (value) {
		const num = props.coinData.decimals > 8 ? 8 : props.coinData.decimals;
		const reg = new RegExp("^(-)*(\\d+)\\.(\\d{1," + num + "}).*$");
		return value.replace(reg, "$1$2.$3");
	} else {
		return "";
	}
};
const clearField = () => {};
const inputValue = (e) => {
	emits("getInputValue", props.coinData.type, e.target.value);
};
</script>

<style lang="scss" scoped>
.window {
	.van-field,
	input {
		--van-field-placeholder-text-color: rgba(25, 30, 53, 0.3);
		font-size: 28px;
		font-weight: 500;
		--van-field-input-disabled-text-color: rgba(25, 30, 53, 0.3);
	}
	.van-cell {
		background-color: #f2f5fe !important;
	}
	.fieldStyle {
		padding-top: 8px !important;
		padding-left: 0px !important;
		padding-right: 5px !important;
		padding-bottom: 0 !important;
	}
}
</style>