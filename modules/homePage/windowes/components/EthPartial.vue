<template>
	<div>
		<div>
			<div class="miners-cost flex justify-between items-center">
				<span class="text-[#7e84a3] text-14px leading-20px">{{ $t('EstGasfee') }}</span>
				<p>
					<span class="text-[#7e84a3] text-12px leading-17px mr-8px">{{ $t('AdvancedSettings') }}</span>
					<van-switch v-model="advanced" active-color="#597BF6" inactive-color="#f5f6fa" />
				</p>
			</div>
			<!-- 矿工费选择 -->
			<div v-if=" !advanced " class="mt-10px flex justify-between h-143px overflow-hidden">
				<div @click="changePrice(index)" v-for="item,index in efficiencyArray" :class="chooseIndex==index ? 'border-[#597bf6]' : 'border-[#ebeef7]'" class="w-110px h-124px border-1px border-solid rounded-8px relative overflow-hidden">
					<div class="h-95px w-108px flex items-center justify-center flex-col">
						<img v-if="estimateGasLoading" src="~~/assets/images/GasFeeLoading.png" class="w-18px mb-4px animate-spin" />
						<p v-else :class="chooseIndex==index ? 'text-[#597bf6]' : 'text-[#191e35]'" class="mb-4px font-500 text-13px leading-15px">{{ getStringNum(BigNumber(gasLimit).times(item).times(gasPrice).shiftedBy(-18), 8) }}</p>
						<p :class="chooseIndex==index ? 'text-[#597bf6]' : 'text-[#191e35]'" class="font-500 text-12px leading-14px">{{ chainInfo[payCoin.chain].coinUnit }}</p>
					</div>
					<div :class="chooseIndex==index ? 'text-[#597bf6]' : 'text-[#191e35]'" class="absolute bottom-0 bg-[#f1f5ff] h-28px w-108px text-center leading-28px text-12px">{{ $t('EstTimes',{val: estimateGasLoading ? '--' : getTime(BigNumber(gasPrice).times(item)) }) }}</div>
				</div>
			</div>
			<!-- 高级设置 -->
			<div v-else class="h-143px mt-10px bg-[#f5f6fa] rounded-12px px-15px py-17px">
				<div class="flex justify-between items-center">
					<p class="text-[#191e35] text-12px leading-14px">
						<span>{{ getStringNum(BigNumber(gas).times(gasLimit).shiftedBy(-18), 8) }}</span>
						<span>&nbsp;{{ chainInfo[payCoin.chain].coinUnit }}&nbsp;</span>
						<span class="font-500">≈ ${{ getStringNum(BigNumber(gas).times(gasLimit).shiftedBy(-18).times(usdtReta), 2) }}</span>
					</p>
					<p class="text-[#191e35] text-12px leading-14px">{{ $t('EstTimes',{val: getTime(BigNumber(sliderValue).shiftedBy(9)) }) }}</p>
				</div>
				<div class="flex justify-between mt-11px text-[#7e84a3] text-12px leading-14px">
					<span>Gas Limit</span>
					<span>{{ gasLimit }}</span>
				</div>
				<div class="flex justify-between mt-11px text-[#7e84a3] text-12px leading-14px">
					<span>Gas Price</span>
					<span>{{ getStringNum(sliderValue, 2) }}</span>
				</div>
				<div class="line-style"></div>
				<div class="mt-20px">
					<van-slider
						bar-height="4px"
						active-color="#597BF6"
						:step="(BigNumber(gasPrice).times(2).shiftedBy(-9).toNumber()-BigNumber(gasPrice).shiftedBy(-9).toNumber())/5"
						:min="BigNumber(gasPrice).shiftedBy(-9).toNumber()"
						:max="BigNumber(gasPrice).times(2).shiftedBy(-9).toNumber()"
						@change="getAdvancedVal"
						v-model="sliderValue"
					>
						<template #button>
							<img src="~~/assets/images/sliderImg.png" class="w-30px h-30px max-w-none" />
						</template>
					</van-slider>
				</div>
			</div>
		</div>
		<div class="w-165px h-44px mt-36px fixed bottom-50px left-90px overflow-hidden">
			<van-button class="w-165px h-44px ripple-btn" :loading="estimateGasLoading || buttonLoading" round @click="toTransaction" color="#597BF6">{{ $t('swapConfirm') }}</van-button>
		</div>
	</div>
</template>

<script setup>
import BigNumber from "bignumber.js";
import { chainInfo } from "~~/helper/chainInfo";
import { getGasPrice } from "~~/helper/eth";
import {
	getEstimateGas,
	getAllowance,
	toApprove,
	transactions,
} from "../common";
import { getStringNum, showSomeingError } from "~~/helper/common";
import useBaseApi from "~~/api/useBaseApi";
import useGasTimeApi from "~~/api/useGasTimeApi";

const props = defineProps({
	payCoin: Object,
});

const originalData = computed(() => {
	return useNuxtApp().$managerScheduler.originalData.value;
});

const advanced = ref(false);
const expTime = ref(1);
const sliderValue = ref(0);
const gasPrice = ref(0);
const gasLimit = ref(0);
const estimateGasLoading = ref(true);
const gas = ref(0);

const efficiencyArray = [1, 1.2, 1.4];
const chooseIndex = ref(0);

const { addSwapTime } = useNuxtApp().$managerScheduler;
const changePrice = (index) => {
	chooseIndex.value = index;
	gas.value = BigNumber(gasPrice.value)
		.times(efficiencyArray[index])
		.toString();
	sliderValue.value =
		efficiencyArray[index] *
		BigNumber(gasPrice.value).shiftedBy(-9).toNumber();
	addSwapTime(
		getTime(BigNumber(gasPrice.value).times(efficiencyArray[index]))
	);
};

const getAdvancedVal = (val) => {
	sliderValue.value = val;
	const index = efficiencyArray.findIndex(
		(item) =>
			item ==
			getStringNum(
				val / BigNumber(gasPrice.value).shiftedBy(-9).toNumber(),
				1
			)
	);
	chooseIndex.value = index > 0 ? index : 0;
	gas.value = BigNumber(gasPrice.value)
		.times(val / BigNumber(gasPrice.value).shiftedBy(-9).toNumber())
		.toString();
	addSwapTime(
		getTime(
			BigNumber(gasPrice.value).times(
				val / BigNumber(gasPrice.value).shiftedBy(-9).toNumber()
			)
		)
	);
};

const allowance = ref(0);

watch(
	() => advanced.value,
	(newVal) => {
		if (!newVal) {
			//默认界面
			changePrice(chooseIndex.value);
			sliderValue.value =
				efficiencyArray[chooseIndex.value] *
				BigNumber(gasPrice.value).shiftedBy(-9).toNumber();
		}
	}
);

const usdtReta = ref(0);
const getDollar = async () => {
	const baseApi = useBaseApi();
	const Str = `${props.payCoin.chain}_0x000`;
	const res = await baseApi.post(({ api }) => {
		return {
			api: api.getCoinPrice,
			data: [Str],
		};
	});
	usdtReta.value = res[Str];
};

const priceRange = ref({});
const getGasTimeByServe = async () => {
	const gasTimeApi = useGasTimeApi();
	const data = await gasTimeApi.get(({ api }) => {
		return {
			api: api.feeList,
		};
	});
	priceRange.value = data.gasPriceRange;
};
const getTime = (gasPrice) => {
	if (props.payCoin.chain != "eth") {
		return 1;
	}
	const price = BigNumber(gasPrice).shiftedBy(-8).toString();
	let list = Object.keys(priceRange.value).sort((a, b) => a - b);
	let newList = [...list, price].sort((a, b) => a - b);
	const index = newList.findIndex((item) => price == item);
	if (index == 0) {
		return priceRange.value[list[0]];
	}
	if (index == newList.length - 1) {
		return priceRange.value[list[list.length - 1]];
	}
	return (
		(priceRange.value[newList[index - 1]] +
			priceRange.value[newList[index + 1]]) /
		2
	);
};

const isMainCost = ref(false);

onMounted(async () => {
	isMainCost.value = props.payCoin.token == "0x000";
	//获取类以太单链gas
	gasPrice.value = await getGasPrice();

	// 判断授权状态;
	if (!isMainCost.value) {
		console.log("判断授权状态");
		allowance.value = await getAllowance(
			props.payCoin.chain,
			props.payCoin.token,
			originalData.value.contractAddress
		);
	}

	const operateType = computed(() => {
		return useNuxtApp().$managerScheduler.operateType.value;
	});

	//拿到gasLimit
	if (allowance.value > 0 || isMainCost.value) {
		//已对合约授权
		console.log("已授权或者主币");
		gasLimit.value =
			(await getEstimateGas(
				props.payCoin.chain,
				originalData.value,
				props.payCoin.token,
				operateType
			)) * 2;
	} else {
		//第一次使用合约
		gasLimit.value =
			(await toApprove(
				props.payCoin.chain,
				props.payCoin.token,
				originalData.value.contractAddress,
				true
			)) * 2;
	}

	//获取当前默认的gas 后面用于交易
	changePrice(0);

	//获取主币对应的汇率
	await getDollar();
	if (props.payCoin.chain == "eth") {
		await getGasTimeByServe();
	}
	addSwapTime(getTime(BigNumber(gasPrice.value).times(1)));
	estimateGasLoading.value = false;
});

const buttonLoading = ref(false);
const emits = defineEmits(["overdoing"]);
const toTransaction = async () => {
	buttonLoading.value = true;
	try {
		if (allowance.value == 0 && !isMainCost.value) {
			console.log("开始授权");
			await toApprove(
				props.payCoin.chain,
				props.payCoin.token,
				originalData.value.contractAddress,
				false
			);
			console.log("授权结束,重新预估gas");
			gasLimit.value =
				(await getEstimateGas(
					props.payCoin.chain,
					originalData.value,
					props.payCoin.token,
					operateType
				)) * 2;
		}
		const hash = await transactions(
			props.payCoin.chain,
			props.payCoin.token,
			gas.value,
			gasLimit.value
		);
		console.log(hash);
		emits("overdoing", hash);
	} catch (error) {
		showSomeingError();
		buttonLoading.value = false;
	}
};
</script>

<style lang="scss" scoped>
.miners-cost {
	.van-switch {
		--van-switch-size: 15px;
		--van-switch-node-box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.25);
		--van-switch-node-size: 15px;
		height: 7.5px;
		width: 30px;
		border: none;
		::v-deep .van-switch__node {
			border: 0.5px rgba(0, 0, 0, 0.25) solid;
			top: -4px;
		}
	}
}
.line-style {
	margin-top: calc(9.5px);
	width: 315px;
	height: 1px;
	transform: rotate(-1.0339326964503624e-14deg);
	border: 0.5px solid;
	/* #e6eaf5 : 分割线-E6EAF5 */
	border-color: #e6eaf5;
}
</style>