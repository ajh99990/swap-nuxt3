<template>
	<div class="w-303px max-h-497px pl-12px pr-15px">
		<div>
			<p class="text-body text-size-14px font-500 my-20px">{{ showChain.title }}</p>
			<div v-if=" !coinList.length && loading " class="flex justify-center items-center">
				<LoadingJson />
			</div>
			<div></div>
		</div>
	</div>
</template>

<script setup>
import useGlobalData from "~~/store/useGlobalData";

const globalData = useGlobalData();

const props = defineProps({
	showChain: Object,
	searchValue: String,
});

const coinList = ref([]);
const loading = ref(true);

watchEffect(() => {
	console.log(props.showChain);
	console.log(props.searchValue);
});

const getCoinList = () => {
	console.log(globalData.appChainsInfo.length);
};

onMounted(() => {
	getCoinList();
});
</script>

<style scoped>
</style>