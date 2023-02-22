<template>
	<div v-if="preface.length" class="flex items-center justify-center text-14px text-minor mt-12px">
		<p @click="exchangePrice">
			<span class="mr-3px font-500 max-w-120px overflow-hidden truncate">{{ order ? preface[0].value + preface[0].symbol : Backwards[0].value + Backwards[0].symbol }}</span>
			<span class="mr-3px inline-block font-500">=</span>
			<span class="mr-3px font-500 max-w-120px overflow-hidden truncate">{{ order ? preface[1].value + preface[1].symbol : Backwards[1].value + Backwards[1].symbol }}</span>
		</p>
		<img @click="getReta()" id="refresh-price" src="@/assets/images/homeRefresh.png" class="ml-8px w-14px h-14px" />
		<!-- <img @click="refreshPrice('click')" id="refresh-price" src="@/assets/images/home/home_refresh.png" class="ml-8px w-14px h-14px" /> -->
	</div>
</template>

<script setup>
import useBaseApi from "~~/api/useBaseApi";
import { getStringNum } from "~~/helper/common";

const baseApi = useBaseApi();
const order = ref(true);
const exchangePrice = () => {
	order.value = !order.value;
};
const preface = ref([]);
const Backwards = ref([]);
const tradingPair = computed(() => {
	return useNuxtApp().$managerScheduler.tradingPair.value;
});
watch(
	() => tradingPair,
	() => {
		console.log("geting");
		order.value = true;
		getReta();
	}
);

const getReta = async () => {
	try {
		const payCoin = tradingPair.value.filter(
			(item) => item.type == "pay"
		)[0];
		const receiveCoin = tradingPair.value.filter(
			(item) => item.type == "receive"
		)[0];
		let payToUsdt, receiveToUsdt;
		try {
			payToUsdt = await baseApi.post(({ api }) => {
				return {
					api: api.getCoinPrice,
					data: [`${payCoin.chain}_${payCoin.token}`],
				};
			});
			receiveToUsdt = await baseApi.post(({ api }) => {
				return {
					api: api.getCoinPrice,
					data: [`${receiveCoin.chain}_${receiveCoin.token}`],
				};
			});
		} catch (error) {}
		preface.value[0] = { symbol: " " + payCoin.symbol, value: 1 };
		preface.value[1] = {
			symbol: " " + receiveCoin.symbol,
			value: getStringNum(
				payToUsdt[`${payCoin.chain}_${payCoin.token}`] /
					receiveToUsdt[`${receiveCoin.chain}_${receiveCoin.token}`],
				8
			),
		};
		Backwards.value[0] = { symbol: " " + receiveCoin.symbol, value: 1 };
		Backwards.value[1] = {
			symbol: " " + payCoin.symbol,
			value: getStringNum(
				receiveToUsdt[`${receiveCoin.chain}_${receiveCoin.token}`] /
					payToUsdt[`${payCoin.chain}_${payCoin.token}`],
				8
			),
		};
	} catch (error) {
		console.log(error);
	}
};
onMounted(() => {
	getReta();
});
</script>

<style scoped>
</style>