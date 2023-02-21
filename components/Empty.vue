<template>
	<div>
		<div v-if="emptyType == 'coin'" class="flex flex-col justify-center items-center">
			<img src="~~/assets/images/searchEmpty.png" class="w-120px h-108px mb-20px" />
			<span class="text-minor text-12px leading-17px">暂无币种</span>
		</div>
		<div v-if="emptyType == 'search'" class="flex flex-col justify-center items-center">
			<img src="~~/assets/images/walletEmpty.png" class="w-120px h-108px mb-20px" />
			<span class="text-minor text-12px leading-17px">暂无搜索结果</span>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	emptyType: String,
});
</script>

<style lang="scss" scoped>
</style>