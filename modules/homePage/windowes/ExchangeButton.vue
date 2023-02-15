<template>
	<div class="mt-16px w-345px h-44px overflow-hidden">
		<!-- <van-button
				:disabled="errorText || !utils.checkChain($store.state.payChain) ? true : false || !(payData.token&&receiveData.token)"
		>{{ !utils.checkChain($store.state.payChain) ? $t('home.Switchtheaddress') : ( errorText ? errorText : buttonText) }}</van-button>-->
		<van-button class="w-345px h-44px ripple-btn" :disabled="disabled" round color="#597BF6" :loading="loading" :loading-text="$t('searching')" @click="exchange">{{ errorText ? errorText : buttonText }}</van-button>
	</div>
</template>

<script setup>
import useGlobalData from "~~/store/useGlobalData";
import { checkChain, buildParams } from "./common";

const globalData = useGlobalData();
const { t } = useI18n();

const disabled = ref(false);
const loading = ref(false);
const buttonText = ref(t("tradingBoxSwap"));
const errorText = ref("");

//不支持链的错误提示
watchEffect(() => {
	disabled.value = checkChain(globalData.presentChain);
	if (disabled.value) {
		errorText.value = t("switchCorresponding");
	}
});

const exchange = (order, type, number) => {
	buildParams(order, type, number);
};
defineExpose({
	exchange,
});
</script>

<style lang="scss" scoped>
.home_btn {
	::v-deep .van-button__text {
		size: 20px !important;
		font-weight: 800 !important;
	}
}
</style>