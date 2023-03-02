<template>
	<div v-if="showDetail" class="mt-22px">
		<Line v-if="detailInfo.routeName" :label="$t('routeName')" :showIcon="false" class="mb-10px">
			<img :src="detailInfo.routeLogo" class="mr-6px h-22px rounded-full" />
			<span class="mr-4px">{{ detailInfo.routeName }}</span>
			<img src="~~/assets/images/rightArrow.png" class="w-15px h-15px" />
		</Line>
		<Line v-else :label="$t('bestChannel')" :showIcon="false" class="mb-10px">
			<img :src="detailInfo.platform" class="h-22px mr-19px" />
		</Line>
		<div v-if="detailInfo.routeName" class="bg-[#f7f9fe] px-14px py-10px mb-10px">
			<Line :label="$t('GasFee')" codeTypes="gasFee" class="mb-10px">
				<span class="mr-5px">$ {{ detailInfo.GasFee }}</span>
			</Line>
			<Line :label="$t('swapTime')" codeTypes="swapTime">
				<span class="mr-5px">~{{ detailInfo.swapTime }}</span>
			</Line>
		</div>
		<Line :label="$t('Slippage')" codeTypes="slippage" class="mb-10px">
			<span :class="detailInfo.priceImpact > 0.8 ? 'text-[#EC585E]' : ' text-body'" class="mr-4px">{{ slippage }} %</span>
			<img @click="showSlippage" src="~~/assets/images/setSlippage.png" class="w-15px h-15px" />
		</Line>
		<div v-if=" !detailInfo.routeName">
			<Line v-if="Number(detailInfo.youSave)>0" :label="$t('youSave')" codeTypes="youSave" class="mb-10px">
				<span class="pr-19px text-[#509F7F]">$ {{ detailInfo.youSave }}</span>
			</Line>
			<Line v-if="detailInfo.priceImpact" :label="$t('PriceImpact')" codeTypes="priceImpace" class="mb-10px">
				<p :class="detailInfo.priceImpact < 0.8 ? '' : 'text-[#EC585E]'" class="pr-19px">
					<span>{{ detailInfo.priceImpact < 0.8 ? '<' : '>' }}</span>
					<span>{{ detailInfo.priceImpact }}%</span>
				</p>
			</Line>
		</div>
		<Line :label="$t('TX.Fee')" codeTypes="TXFee" class="mb-10px">
			<span class="pr-19px">{{ detailInfo.TXFee }}</span>
		</Line>
		<Line :label="$t('ReceivingAddress')" codeTypes="receiveAddress" class="mb-10px">
			<span class="mr-4px">{{ simplifyToken(receiveAddress) }}</span>
			<img @click="editPageReceiveAddress" src="~~/assets/images/setAddress.png" class="w-15px h-15px" />
		</Line>
		<PopUps propHeight="323px" popupTitle="修改滑点" :showState="showSlippageBox" @closePropUp="closeSlippageBox">
			<div class="h-260px pt-24px px-15px relative overflow-hidden">
				<div class="slippage_input">
					<van-field v-model="pageSlippage" maxlength="6" type="number" label-align="left">
						<template #right-icon>
							<span class="text-size-16px font-800 text-minor">%</span>
						</template>
					</van-field>
				</div>
				<div class="h-36px mt-15px rounded-full bg-[#fff] border-[#e6eaf5] border-1px border-solid flex justify-around items-center">
					<span @click="changeSlippageVal(item.value)" v-for="(item, index) in slippageData" :key="index" :class="slippageIndex == index ? 'bg-[#E6EAF5] text-[#597BF6]' : 'bg-[#fff] text-[#7e84a3]'" class="font-500 text-size-14px w-86.25px text-center py-10px rounded-full">{{ item.label}}</span>
				</div>
				<p class="text-12px mt-10px text-[#E69F5E] leading-16px flex items-center justify-center">
					<img src="~~/assets/images/tips.png" class="w-14px inline-block relative -top-1px" />
					<span>{{ $t('slippageRecommended') }}</span>
				</p>
				<p v-if="pageSlippage>100 || pageSlippage < 0" class="mt-10px text-center text-size-14px text-[#EC585E]">{{ $t('inputnumber0-100') }}</p>
				<div class="text-center absolute bottom-20px w-360px">
					<van-button type="primary" round class="w-165px h-44px" :disabled="pageSlippage>100 || pageSlippage < 0" @click="slippageSubmit">{{ $t('confirm') }}</van-button>
				</div>
			</div>
		</PopUps>
		<PopUps propHeight="323px" popupTitle="修改收款地址" :showState="showAddressBox" @closePropUp="closeAddressBox">
			<div class="relative address_input h-260px pt-35px px-15px">
				<van-field v-model="pageReceiveAddress" autosize clearable @focus="resetJudge" rows="1" type="textarea" :placeholder="$t('inputAddress')" label-align="left" />
				<p v-if="showAddressError" class="mt-10px min-h-16px text-[#EC585E] text-14px font-500">{{ $t('checkToAddress') }}</p>
				<span v-if=" !pageReceiveAddress " class="text-size-16px text-[#597BF6] absolute right-25px top-38px" @click="pasteAddress">{{ $t('Pasted') }}</span>
				<div class="absolute bottom-20px w-360px text-center">
					<van-button type="primary" round class="w-165px h-44px" :disabled="showAddressError" @click="addressSubmit">{{ $t('confirm') }}</van-button>
				</div>
			</div>
		</PopUps>
	</div>
</template>

<script setup>
import { simplifyToken } from "~~/helper/common";
import Line from "./commons/line.vue";
import { postMessageAppCallback } from "~~/helper/postMessage";
import { ETHChain, TRONChain } from "~~/helper/chainInfo";
import { checkTronAddress } from "~~/helper/tron/index";
import { checkAddress } from "~~/helper/eth";

const { t } = useI18n();

//底部处接收地址和滑点意外的信息展示
const detailInfo = computed(() => {
	return useNuxtApp().$managerScheduler.transactionDetails.value;
});
//是否展示底部的详情
const showDetail = computed(() => {
	return useNuxtApp().$managerScheduler.showDetail.value;
});
//单独获取展示的滑点 ===> 因为同时存在两个值
const slippage = computed(() => {
	return useNuxtApp().$managerScheduler.slippage.value;
});
//单独获取接收地址 ===> 因为同时存在两个值
const receiveAddress = computed(() => {
	return useNuxtApp().$managerScheduler.receiveAddress.value;
});
//获取默认的滑点
const slippageData = computed(() => {
	return [
		{
			label: t("auto"),
			value: useNuxtApp().$managerScheduler.defaultSlippage.value,
		},
		{ label: "0.5%", value: "0.5" },
		{ label: "1%", value: "1" },
		{ label: "2%", value: "2" },
	];
});
//对于滑点的一些操作
const pageSlippage = ref("");
watch(
	() => slippage.value,
	() => {
		pageSlippage.value = slippage.value;
	},
	{ immediate: true }
);
const showSlippageBox = ref(false);
const slippageIndex = computed(() => {
	if (pageSlippage.value == slippageData.value[0].value) {
		return 0;
	} else {
		return slippageData.value.findIndex(
			(item) => item.value == pageSlippage.value
		);
	}
});
const showSlippage = () => {
	showSlippageBox.value = true;
};
const changeSlippageVal = (value) => {
	pageSlippage.value = value;
};
const { editSlippage } = useNuxtApp().$managerScheduler;
const slippageSubmit = () => {
	editSlippage(pageSlippage.value);
	showSlippageBox.value = false;
};
const closeSlippageBox = () => {
	showSlippageBox.value = false;
};
// -------------------Done

const pageReceiveAddress = ref("");
watch(
	() => receiveAddress.value,
	() => {
		pageReceiveAddress.value = receiveAddress.value;
	},
	{ immediate: true }
);
const showAddressBox = ref(false);
const showAddressError = ref(false);
const closeAddressBox = () => {
	showAddressBox.value = false;
};
const editPageReceiveAddress = () => {
	showAddressBox.value = true;
};
const pasteAddress = async () => {
	const address = await postMessageAppCallback("getClipboardText", {});
	pageReceiveAddress.value = address;
};
const { editReceiveAddress } = useNuxtApp().$managerScheduler;
const addressSubmit = async () => {
	const judge = await checkToAddress();
	if (judge) {
		showAddressError.value = false;
		editReceiveAddress(pageReceiveAddress.value);
		closeAddressBox();
	} else {
		showAddressError.value = true;
	}
};
const tradingPair = useNuxtApp().$managerScheduler.tradingPair.value;
const checkToAddress = async () => {
	const type = tradingPair.filter((item) => item.type == "receive")[0].chain;
	if (ETHChain.includes(type)) {
		return checkAddress(pageReceiveAddress.value);
	}
	if (TRONChain.includes(type)) {
		return await checkTronAddress(pageReceiveAddress.value);
	}
};

const resetJudge = () => {
	showAddressError.value = false;
};
</script>

<style lang="scss" scoped>
.slippage_input {
	.van-field {
		--van-field-placeholder-text-color: #7e84a3;
		font-size: 16px;
		background: #f5f6fa;
		border-radius: 12px;
		font-weight: 800;
		height: 56px;
		line-height: 36px;
	}
}
.address_input {
	:deep(.van-cell) {
		border-radius: 12px;
		background-color: #f5f6fa !important;
		font-weight: 500;
		font-size: 16px;
	}
}
</style>