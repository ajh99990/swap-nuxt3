<template>
	<div class="flex justify-between items-center">
		<p class="flex items-center">
			<span class="text-minor text-size-14px font-400 leading-21px">{{ label }}</span>
			<img v-if="showIcon" src="~~/assets/images/notes.png" class="w-12px h-12px ml-6px" @click="openBox" />
		</p>
		<p class="flex items-center">
			<slot></slot>
		</p>
		<van-popup v-model:show="showBox" round>
			<div class="w-305px rounded-18px px-25px py-20px flex justify-center flex-col">
				<p class="text-center text-[#191e35] font-500 text-18px leading-25px mb-20px">{{showText.title}}</p>
				<div class="text-[#191e35] text-14px leading-22px mb-20px">{{ showText.content }}</div>
				<p v-if="showText.warnText" class="text-[#EC585E] text-size-14px font-500 leading-22px mb-20px">{{ showText.warnText }}</p>
				<van-button type="primary" round @click="closeBox">好的</van-button>
			</div>
		</van-popup>
	</div>
</template>

<script setup>
const { t } = useI18n();
const props = defineProps({
	label: String,
	codeTypes: String,
	showIcon: {
		type: Boolean,
		default: true,
	},
});

const showBox = ref(false);
const boxText = {
	gasFee: {
		title: t("GasFeeTitle"),
		content: t("GasFeeContent"),
	},
	swapTime: {
		title: t("swapTimeTitle"),
		content: t("swapTimeContent"),
	},
	slippage: {
		title: t("WhatIsSlippage"),
		content: t("slippageContent"),
	},
	youSave: {
		title: t("youSaveTitle"),
		content: t("youSaveContent"),
	},
	priceImpace: {
		title: t("priceImpaceTitle"),
		content: t("priceImpaceContent"),
	},
	TXFee: {
		title: t("TXFeeTitle"),
		content: t("TXFeeContent"),
	},
	receiveAddress: {
		title: t("receiveAddressTitle"),
		content: t("receiveAddressContent"),
		warnText: t("receiveAddressWarnText"),
	},
};
const showText = ref({});

const openBox = () => {
	showText.value = boxText[props.codeTypes];
	showBox.value = true;
};
const closeBox = () => {
	showBox.value = false;
};
</script>

<style lang="scss" scoped>
</style>