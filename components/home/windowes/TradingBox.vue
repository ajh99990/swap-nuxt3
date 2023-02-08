<template>
	<div>
		<div class="h-336px relative">
			<div id="windowUp">
				<HomeWindowesWindow :class=" order ? '' : 'translate-y-170px' " class="transform duration-400" :coinData="tradingPair[0]" @showCoinList="showCoinList" />
			</div>
			<div id="windowDown">
				<HomeWindowesWindow :class=" order ? '' : '-translate-y-170px' " class="transform duration-400 mt-4px" :coinData="tradingPair[1]" @showCoinList="showCoinList" />
			</div>
			<HomeWindowesSwitchWindowIcon @click="switchTrade" class="w-34px absolute top-0 z-10 left-0 right-0 bottom-0 m-auto" />
		</div>
		<div class="mt-16px">
			<HomeExchangeButton />
		</div>
		<HomeCoinListSwitchChain :popupState="popupState" />
	</div>
</template>

<script setup>
import { chainInfo } from "~~/helper/chainInfo";

const tradingPair = chainInfo["bsc"].defaultTrade;

const order = ref(true);
watch(
	() => order.value,
	() => {
		tradingPair[0].type = order.value ? "pay" : "receive";
		tradingPair[1].type = order.value ? "receive" : "pay";
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

const popupState = ref(false);
const showCoinList = () => {
	popupState.value = true;
};
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