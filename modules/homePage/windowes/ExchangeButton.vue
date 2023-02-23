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
import { getStringNum } from "~~/helper/common";
import useJudgeFun from "../switchChain/judgeFun";
import { checkChain } from "./common";

const globalData = useGlobalData();
const { t } = useI18n();

//按钮的状态值
const buttonText = ref(t("tradingBoxSwap"));
const disabled = ref(false);
const loading = computed(() => {
	return useNuxtApp().$managerScheduler.loading.value;
});
// const showDetail = computed(() => {
// 	return useNuxtApp().$managerScheduler.showDetail.value;
// });

watchEffect(async () => {
	console.log("enter button");
	const statusString = useNuxtApp().$managerScheduler.isStatus.value;
	if (statusString == "error") {
		disabled.value = true;
		buttonText.value = t("notSupported");
	}
	if (statusString == "normal") {
		disabled.value = false;
		buttonText.value = t("swapConfirm");
	}
	if (statusString == "empty") {
		disabled.value = false;
		buttonText.value = t("tradingBoxSwap");
	}
	if (statusString == "noMoney") {
		disabled.value = true;
		buttonText.value = t("noMoney");
	}
});

//不支持链的错误提示
const notSupport = ref("");
const notChain = ref(false);
watchEffect(() => {
	notChain.value = checkChain(globalData.presentChain);
	if (notChain.value) {
		notSupport.value = t("switchCorresponding");
	}
});

//点击确认交易按钮
const payCoin = computed(() => {
	const tradingPair = useNuxtApp().$managerScheduler.tradingPair.value;
	const payCoin = tradingPair.filter((item) => item.type == "pay")[0];
	return payCoin;
});
const exchange = async () => {
	if (!payCoin.value.amount) {
		disabled.value = true;
		buttonText.value = t("inputAmount");
		return;
	}
	alert("开始交易");
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