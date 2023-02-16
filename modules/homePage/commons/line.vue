<template>
	<div class="flex justify-between items-center">
		<p class="flex items-center">
			<span class="text-minor text-size-14px font-400 leading-21px">{{ label }}</span>
			<img src="~~/assets/images/notes.png" class="w-12px h-12px ml-6px" @click="open" />
		</p>
		<p class="flex items-center">
			<slot></slot>
		</p>
	</div>
</template>

<script setup>
const props = defineProps({
	label: String,
});
const open = () => {};
</script>

<style lang="scss" scoped>
</style>