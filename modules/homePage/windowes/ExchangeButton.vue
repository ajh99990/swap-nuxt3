<template>
	<div class="mt-16px w-345px h-44px overflow-hidden">
		<van-button class="w-345px h-44px ripple-btn" :disabled="disabled || notChain" round color="#597BF6" :loading="loading" :loading-text="$t('searching')" @click="exchange">{{ notSupport ? notSupport : buttonText }}</van-button>
		<PopUps propHeight="560px" popupTitle="确认兑换" :showState="showConfirmBox" @closePropUp="closeConfirmBox">
			<div class="h-512px w-375px pt-16px px-15px">
				<TradingPair :tradingPair="tradingPair"></TradingPair>
				<div class="text-[#7e84a3] text-14px leading-20px mt-20px mb-10px">收款地址</div>
				<div class="text-14px text-[#191e35] font-500 leading-22px break-words">{{ toAddress }}</div>
				<div class="h-1px bg-[#e6eaf5] mt-15.5px mb-17.5px"></div>
				<!-- <MinersCost :pay-coin="payCoin" /> -->
				<TronPartial :pay-coin="payCoin" />
			</div>
		</PopUps>
	</div>
</template>

<script setup>
import MinersCost from "./components/MinersCost.vue";
import useGlobalData from "~~/store/useGlobalData";
import { checkChain } from "./common";
import TronPartial from "./components/TronPartial.vue";

const globalData = useGlobalData();
const { t } = useI18n();

//按钮的状态值
const buttonText = ref(t("tradingBoxSwap"));
const disabled = ref(false);
const loading = computed(() => {
	return useNuxtApp().$managerScheduler.loading.value;
});
watchEffect(async () => {
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
const tradingPair = computed(() => {
	return useNuxtApp().$managerScheduler.tradingPair.value;
});
const payCoin = computed(() => {
	const payCoin = tradingPair.value.filter((item) => item.type == "pay")[0];
	return payCoin;
});
const toAddress = computed(() => {
	return useNuxtApp().$managerScheduler.receiveAddress.value;
});

const showConfirmBox = ref(false);

//点击兑换按钮
const { stopQuery, swapQuery } = useNuxtApp().$managerScheduler;
const exchange = async () => {
	//判断是否有输入值
	if (!payCoin.value.amount) {
		disabled.value = true;
		buttonText.value = t("inputAmount");
		return;
	}
	showConfirmBox.value = true;
	stopQuery();
};

const closeConfirmBox = () => {
	showConfirmBox.value = false;
	swapQuery();
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