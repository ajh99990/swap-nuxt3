<template>
	<div class="flex items-center justify-center text-14px text-minor mt-12px">
		<p @click="exchangePrice">
			<span class="mr-3px font-500 max-w-120px overflow-hidden truncate">{{ '1 BNB' }}</span>
			<span class="mr-3px inline-block font-500">=</span>
			<span class="mr-3px font-500 max-w-120px overflow-hidden truncate">{{ '311 USDT' }}</span>
		</p>
		<img @click="refreshPrice('click')" id="refresh-price" src="@/assets/images/homeRefresh.png" class="ml-8px w-14px h-14px" />
		<!-- <img @click="refreshPrice('click')" id="refresh-price" src="@/assets/images/home/home_refresh.png" class="ml-8px w-14px h-14px" /> -->
	</div>
</template>

<script setup>
const order = ref(true);
const exchangePrice = () => {};
const refreshPrice = () => {};
</script>

<style scoped>
</style>