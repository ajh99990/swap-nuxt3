<template>
	<div class="pt-12px px-16px h-100vh">
		<TradingBox />
		<ExchangeRate />
		<History />
	</div>
</template>

<script setup>
import TradingBox from "~~/modules/homePage/windowes/TradingBox.vue";
import ExchangeRate from "~~/modules/homePage/ExchangeRate.vue";
import History from "~~/modules/homePage/History.vue";
</script>

<style lang="scss" scoped>
</style>