<template>
	<van-button class="w-345px m-auto mt-16px" type="primary" @click="exchange">{{ errorText ? errorText : buttonText }}</van-button>
</template>

<script setup>
const { t } = useI18n();
const buttonText = t("tradingBoxSwap");
const errorText = "余额不足";
const exchange = () => {};
</script>

<style lang="scss" scoped>
</style>