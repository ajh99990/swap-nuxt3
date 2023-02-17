<template>
	<div>
		<div class="border-b-1px border-b-[#E6EAF5] border-solid">
			<van-search class="search_style" v-model="searchVal" @clear="clearInput" :placeholder="$t('contractAddress')">
				<template v-slot:left-icon>
					<img src="@/assets/images/icon_search.png" class="w-16px mt-4px mr-4px" />
				</template>
			</van-search>
		</div>
		<div class="flex">
			<div class="w-72px h-497px overflow-y-auto hidder-scrollbar bg-[#f5f6fa]">
				<div v-for=" ( item , index ) in coinTypeArray " :key="index" @click="changeIndex(index,item.code)" :class="chooseIndex == index ? 'bg-[#FFF] font-500' : '' " class="py-12.5px flex items-center justify-center flex-col">
					<img :src=" chooseIndex == index ? item.lightIcon : item.darkIcon" class="w-27px rounded-full mb-5px" />
					<span :class="chooseIndex == index ? 'text-[#191e35]' : 'text-[#7e84a3]'" class="text-10px">{{ item.leftCode }}</span>
				</div>
			</div>
			<div v-for="item,index in coinTypeArray" :key="item.code">
				<div v-if="index == chooseIndex">
					<CoinList :showChain="coinTypeArray[chooseIndex]" :searchValue="searchVal" @closePropUp="closePropUp" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import CoinList from "./coinList.vue";
import { chainList } from "~~/helper/chainInfo";
import useGlobalData from "~~/store/useGlobalData";

const globalData = useGlobalData();

const props = defineProps({
	openChain: String,
});

const searchVal = ref("");
const chooseIndex = ref(2);
const coinTypeArray = ref([]);

const clearInput = () => {};
const changeIndex = (index) => {
	chooseIndex.value = index;
};

onMounted(() => {
	coinTypeArray.value =
		globalData.appChainsInfo.length < 3
			? chainList().filter((item, index) => index != 1)
			: chainList();
	chooseIndex.value = chainList().findIndex(
		(item) => item.code == props.openChain
	);
});

const emit = defineEmits(["closePropUp"]);
const closePropUp = () => {
	emit("closePropUp");
};
</script>

<style lang="scss" scoped>
.search_style {
	--van-search-content-background-color: #f5f6fa;
	// input ::-webkit-input-placeholder {
	// 	color: skyblue;
	// }
	:deep(.van-search__content) {
		border-radius: 8px;
	}
	:deep(.van-field__control::-webkit-input-placeholder) {
		color: #7e84a3;
	}
}
</style>
