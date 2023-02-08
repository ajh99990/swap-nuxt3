<template>
	<div class="w-303px max-h-497px pl-12px pr-15px">
		<div>
			<p class="text-body text-size-14px font-500 my-20px">{{ showChain.title }}</p>
			<div v-if=" !coinList.length && loading " class="flex justify-center items-center h-249px">
				<LoadingJson />
			</div>
			<div v-else></div>
		</div>
	</div>
	{}
</template>

<script setup>
import useGlobalData from "~~/store/useGlobalData";
import useBaseApi from "~~/api/useBaseApi";

const baseApi = useBaseApi();
const globalData = useGlobalData();

const props = defineProps({
	showChain: Object,
	searchValue: String,
});

const coinList = ref([]);
const loading = ref(true);

watch(
	() => [props.showChain, props.searchValue],
	() => {
		getCoinList();
	}
);

const getCoinList = () => {
	console.log("getCoinList");
	if (props.searchValue) {
		getSearchList();
	} else {
		getChainList();
	}
};

const getSearchList = () => {};

const getChainList = () => {
	coinList.value = globalData.allCoinList[props.showChain.code] || [];
};

onMounted(() => {
	console.log(props.showChain);
	getCoinList();
});
</script>

<style scoped>
</style>