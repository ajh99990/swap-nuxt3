<template>
	<div class="pt-12px px-16px h-100vh">
		<TradingBox />
		<ExchangeRate />
		<TradeDetails />
		<History />
	</div>
</template>

<script setup>
import TradingBox from "~~/modules/homePage/windowes/TradingBox.vue";
import ExchangeRate from "~~/modules/homePage/ExchangeRate.vue";
import History from "~~/modules/homePage/History.vue";
import TradeDetails from "~~/modules/homePage/tradeDetails.vue";
</script>

<style lang="scss" scoped>
</style>