<template>
	<div class="mt-16px">
		<van-button class="w-345px m-auto" type="primary" @click="exchange">{{ errorText ? errorText : buttonText }}</van-button>
	</div>
</template>

<script setup>
const { t } = useI18n();
const buttonText = t("tradingBoxSwap");
const errorText = "余额不足";
const exchange = () => {};
</script>

<style lang="scss" scoped>
</style>