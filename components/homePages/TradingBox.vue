<template>
	<div class="relative">
		<div>
			<HomePagesWindow :coinData="tradingPair[0]" />
			<img src="@/assets/icons/images/windowSwitch.png" class="w-34px absolute top-0 left-0 right-0 bottom-0 m-auto" />
			<HomePagesWindow :coinData="tradingPair[1]" />
		</div>
		<div class="mt-16px">
			<van-button class="w-345px m-auto mt-16px" type="primary" @click="exchange">{{ errorText ? errorText : buttonText }}</van-button>
		</div>
	</div>
</template>

<script setup>
const { t } = useI18n();
const tradingPair = [
	{
		type: "pay",
		chain: "bsc",
		symbol: "USDT",
		token: "0x55d398326f99059ff775485246999027b3197955",
		decimals: 18,
		logo: "https://swap-jp.s3.amazonaws.com/file/bsc/0x55d398326f99059ff775485246999027b3197955.png",
		amount: "",
		balance: "0.00",
		totalAmount: "0.00",
	},
	{
		type: "receive",
		chain: "bsc",
		symbol: "BNB",
		token: "0x000",
		decimals: 18,
		logo: "https://swap-jp.s3.amazonaws.com/file/bsc/0x000.png",
		amount: "",
		balance: "0.00",
		totalAmount: "0.00",
	},
];
const buttonText = t("tradingBoxSwap");
const errorText = "余额不足";
const order = ref(true);

const exchange = () => {};

onMounted(() => {
	console.log(locale);
});
</script>

<style lang="scss" scoped></style>
