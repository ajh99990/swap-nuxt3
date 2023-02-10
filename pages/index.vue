<template>
	<div class="pt-12px px-16px h-100vh">
		<TradingBox />
		<ExchangeButton />
		<History />
	</div>
</template>

<script setup>
import TradingBox from "~~/modules/homePage/windowes/TradingBox.vue";
import ExchangeButton from "~~/modules/homePage/ExchangeButton.vue";
import History from "~~/modules/homePage/History.vue";
</script>

<style lang="scss" scoped>
</style>