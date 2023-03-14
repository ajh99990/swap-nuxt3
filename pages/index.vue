<template>
	<div class="pt-12px px-16px h-100vh">
		<TradingBox />
		<ExchangeRate class="mt-12px" />
		<TradeDetails />
	</div>
</template>

<script setup>
import TradingBox from "~~/modules/homePage/windowes/TradingBox.vue";
import ExchangeRate from "~~/modules/homePage/ExchangeRate.vue";
import TradeDetails from "~~/modules/homePage/tradeDetails.vue";
</script>

<style lang="scss" scoped>
</style>