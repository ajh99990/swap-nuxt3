<template>
	<div>
		<div class="h-336px relative">
			<div id="windowUp">
				<Window :class=" order ? '' : 'translate-y-170px' " class="transform duration-400" :coinData="tradingPair[0]" :componentIndex="0" :isCross="isCross" @showCoinList="showCoinList" @getInputValue="getInputValue" />
			</div>
			<div id="windowDown">
				<Window :class=" order ? '' : '-translate-y-170px' " class="transform duration-400 mt-4px" :coinData="tradingPair[1]" :componentIndex="1" :isCross="isCross" @showCoinList="showCoinList" @getInputValue="getInputValue" />
			</div>
			<SwitchIcon @click="switchTrade" class="w-34px absolute top-0 z-10 left-0 right-0 bottom-0 m-auto" />
		</div>
		<ExchangeButton ref="exchangeButton" />
		<PopUps propHeight="600px" popupTitle="选择币种" :showState="popupState" @closePropUp="closePropUp">
			<SwitchChain :openChain="openChain" @closePropUp="closePropUp" />
		</PopUps>
	</div>
</template>

<script setup>
import Window from "./Window.vue";
import SwitchIcon from "./SwitchIcon.vue";
import SwitchChain from "../switchChain/index.vue";
import useGlobalData from "~~/store/useGlobalData";
import { changeChain } from "~~/plugins/2.processManager/core";
import ExchangeButton from "./ExchangeButton.vue";
import { getUseCoin } from "./common";

const globalData = useGlobalData();

const tradingPair = ref("");
const isCross = ref(false);
watch(
	useNuxtApp().$managerScheduler.tradingPair.value,
	(newVal) => {
		tradingPair.value = newVal;
		isCross.value =
			tradingPair.value[0].chain != tradingPair.value[1].chain;
	},
	{ immediate: true }
);

const { initData } = useNuxtApp().$managerScheduler;
const order = ref(true);
watch(
	() => order.value,
	() => {
		tradingPair.value[0].type = order.value ? "pay" : "receive";
		tradingPair.value[1].type = order.value ? "receive" : "pay";
		const payCoin = getUseCoin(tradingPair.value, "pay");
		changeChain(payCoin.chain);
		initData();
		// const tradingPairIndex = order ? 0 : 1;
		// if (payCoin.amount) getInputValue(tradingPairIndex, "pay", payCoin.amount);
	}
);
const switchTrade = () => {
	order.value = !order.value;
	cssAnimation();
};
const cssAnimation = () => {
	const up = document.getElementById("windowUp");
	const down = document.getElementById("windowDown");
	up.classList.add(order.value ? "down-window" : "up-window");
	down.classList.add(order.value ? "up-window" : "down-window");
	setTimeout(() => {
		[up.className, down.className] = ["", ""];
	}, 400);
};

const windowType = ref("");
const tradingPairIndex = ref("");
const popupState = ref(false);
const openChain = ref(globalData.presentChain);
const showCoinList = (chain, type, componentIndex) => {
	popupState.value = true;
	openChain.value = chain;
	windowType.value = type;
	tradingPairIndex.value = componentIndex;
};

const closePropUp = () => {
	popupState.value = false;
};

const { giveAmount } = useNuxtApp().$managerScheduler;
const getInputValue = (tradingPairIndex, type, value) => {
	giveAmount(tradingPairIndex, type, value);
};

provide("windowType", windowType);
provide("tradingPairIndex", tradingPairIndex);
</script>

<style lang="scss" scoped>
.up-window {
	z-index: 10;
	position: relative;
	animation: upToDown 0.4s linear 1;
}
.down-window {
	z-index: 5;
	position: relative;
	animation: downToUp 0.4s linear 1;
}
@keyframes upToDown {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.08);
	}
	100% {
		transform: scale(1);
	}
}
@keyframes downToUp {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(0.92);
	}
	100% {
		transform: scale(1);
	}
}
</style>