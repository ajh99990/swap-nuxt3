<template>
	<div class="mt-16px w-345px h-44px overflow-hidden">
		<!-- <van-button
				:disabled="errorText || !utils.checkChain($store.state.payChain) ? true : false || !(payData.token&&receiveData.token)"
		>{{ !utils.checkChain($store.state.payChain) ? $t('home.Switchtheaddress') : ( errorText ? errorText : buttonText) }}</van-button>-->
		<van-button class="w-345px h-44px ripple-btn" :disabled="disabled || notChain" round color="#597BF6" :loading="loading" :loading-text="$t('searching')" @click="exchange">{{ notSupport ? notSupport : buttonText }}</van-button>
	</div>
</template>

<script setup>
import useGlobalData from "~~/store/useGlobalData";
import { checkChain } from "./common";

const globalData = useGlobalData();
const { t } = useI18n();

const disabled = ref(false);
const notChain = ref(false);
const loading = computed(() => {
	return useNuxtApp().$managerScheduler.loading.value;
});

const buttonText = ref(t("tradingBoxSwap"));

watch(
	() => useNuxtApp().$managerScheduler.isError.value,
	(newVal) => {
		if (newVal) {
			disabled.value = true;
			buttonText.value = t("notSupported");
		} else {
			disabled.value = false;
			buttonText.value = t("tradingBoxSwap");
		}
	},
	{ immediate: true }
);

//不支持链的错误提示
const notSupport = ref("");
watchEffect(() => {
	notChain.value = checkChain(globalData.presentChain);
	if (notChain.value) {
		notSupport.value = t("switchCorresponding");
	}
});

const showDetail = computed(() => {
	return useNuxtApp().$managerScheduler.showDetail.value;
});
const exchange = (order, type, number) => {
	if (showDetail.value) {
		alert("开始交易");
	}
};
</script>

<style lang="scss" scoped>
.home_btn {
	:deep(.van-button__text) {
		size: 20px !important;
		font-weight: 800 !important;
	}
}
</style>