<template>
	<div class="w-303px max-h-497px pl-12px pr-15px">
		<div class="relative">
			<p class="text-body text-size-14px font-500 my-20px">{{ showChain.title }}</p>
			<div v-if="loading" class="flex justify-center items-center h-439px w-280px absolute left-0 top-0 z-30">
				<Loading />
			</div>
			<div v-if=" showEmpty && !loading " class="flex justify-center items-center h-439px w-280px absolute left-0 top-0">
				<Empty :empty-type=" !searchCoinList.length ? 'search' : 'coin' " />
			</div>
			<div class="h-439px overflow-y-auto vant-loading hidder-scrollbar">
				<van-list v-model:loading="addLoading" loading-text :finished="finished"
					:finished-text="pageList.length >= 7 ? $t('noData') : ''" @load="onLoad" offset="50">
						<div v-for=" item in pageList " :key="item.token" class="mb-30px relative">
							<div class="flex items-center" @click="chooseItem(item)">
								<Images :logo="item.logo" logoWidth="34px" :logoName="item.coinName" :smallCoin="true" class="mr-10px" />
								<p class="flex max-w-160px flex-col">
								<p class="flex">
									<span class="truncate text-body font-500 text-size-15px leading-18px mb-5px max-w-85px inline-block">{{
										item.coinName }}</span>
									<span v-if="showChain.code == 'history' || showChain.code == 'allChain'"
										class="text-12px text-[#7E84A3] inline-block ml-5px">({{ chainInfo[item.chain].fullName }})</span>
								</p>
								<span class="truncate text-minor text-size-11px leading-13px">{{
									simplifyToken(item.token)
								}}</span>
								</p>
								<p class="flex w-120px flex-col items-end absolute top-0.5px right-0">
								<p class="truncate text-body font-500 text-size-15px leading-18px text-right mb-5px max-w-98px">{{
									item.totalAmount }}</p>
								<p class="truncate text-minor text-size-11px leading-13px font-500 text-right max-w-98px">${{ item.balance
									== 0 ? '0.00' : item.balance }}</p>
								</p>
							</div>
							<div
								v-if="(item.chain == tradingPair[0].chain && item.token == tradingPair[0].token) || (item.chain == tradingPair[1].chain && item.token == tradingPair[1].token)"
								class="absolute top-0 left-0 w-276px h-36px bg-[#fff] bg-opacity-50"></div>
						</div>
				</van-list>
			</div>
		</div>
	</div>
</template>

<script setup>
import useGlobalData from "~~/store/useGlobalData";
import useBaseApi from "~~/api/useBaseApi";
import { chainInfo } from "~~/helper/chainInfo";
import { simplifyToken } from "~~/helper/common";
import { coinSort } from "./orderByCoin";
import { isEmpty } from "lodash";

const baseApi = useBaseApi();
const globalData = useGlobalData();

const props = defineProps({
	showChain: Object,
	searchValue: String,
});

const tradingPair = computed(() => {
	return useNuxtApp().$managerScheduler.tradingPair.value;
});

const coinList = ref([]);
const searchCoinList = ref([])
const pageList = computed(()=>{
	return props.searchValue ? searchCoinList.value : coinList.value
})


const loading = ref(false);
const addLoading = ref(true);
const pageNum = ref(1);
const finished = ref(false);
const totalRecords = ref(0);
const showEmpty = ref(false)

watch(
	() => props.showChain,
	() => {
		getCoinList();
	}
);

watch(
	() => props.searchValue,
	() => {
		finished.value = false;
		addLoading.value = true;
		getSearchCoinList();
	}
);

const getCoinList = async () => {
	// console.log('start getCoinList');
	finished.value = true;
	coinList.value = globalData.allCoinList?.[props.showChain.code] || [];
	loading.value = coinList.value.length ? false : true;
	const fetchData = await getInterFaceData();
	if(fetchData.list.length){
		showEmpty.value = false
		totalRecords.value = fetchData.totalRecords;
		coinList.value = await coinSort(props.showChain.code, fetchData.list);
		upDatePina(props.showChain.code, coinList.value);
		loading.value = false;
	}
	// console.log('getCoinList done');
};

const getSearchCoinList = async () => {
	// console.log('start getSearchCoinList');
	if (!props.searchValue) {
		showEmpty.value = false
		getCoinList();
		return;
	}
	let cacheData = globalData.searchCoinList?.[props.showChain.code]?.[
		props.searchValue
	] || { list: [], totalRecords: 0, pageNum: 1 };
	if (cacheData.list.length) {
		searchCoinList.value = cacheData.list;
		totalRecords.value = cacheData.totalRecords;
		pageNum.value = cacheData.pageNum;
	} else {
		console.log('start search');
		loading.value = true;
		const fetchData = await getInterFaceData();
		if (fetchData != "cancel") {
			if(fetchData.list.length){
				showEmpty.value = false
			if (pageNum.value > 1) {
				searchCoinList.value.push(...fetchData.list);
				searchCoinList.value = await coinSort(
					props.showChain.code,
					searchCoinList.value
				);
			} else {
				searchCoinList.value = await coinSort(
					props.showChain.code,
					fetchData.list
				);
			}
			totalRecords.value = fetchData.totalRecords;
			loading.value = false;
			addLoading.value = false;
			// upDatePina(props.showChain.code, searchCoinList.value);
			} else {
				searchCoinList.value = []
				showEmpty.value = true
				loading.value = false
			}
			
		} else {
			finished.value = true;
		}
	}
};

const getInterFaceData = async () => {
	const interfaceData = await baseApi.post(({ api }) => {
		return {
			api: api.coinList,
			onlySend: true,
			data: {
				chain: props.showChain.chain,
				pageNum: pageNum.value,
				pageSize: 20,
				queryType: props.showChain.queryType,
				word: props.searchValue,
			},
		};
	});
	if (interfaceData.code == 901){
		return 'cancel'
	};
	console.log('search success');
	return interfaceData;
};

//加载更多
const onLoad = () => {
	if (searchCoinList.value.length >= totalRecords.value) {
		finished.value = true;
		return;
	}
	++pageNum.value;
	getSearchCoinList();
};

//本地跟线缓存
const upDatePina = (key, list) => {
	const allCoinList = globalData.allCoinList;
	allCoinList[key] = list;
	globalData.$patch({
		allCoinList,
	});
};

const { switchSingleCoin } = useNuxtApp().$managerScheduler

const emit = defineEmits(["closePropUp"]);
const windowType = inject('windowType')
const tradingPairIndex = inject('tradingPairIndex')
const chooseItem = (item) => {
	switchSingleCoin(item, tradingPairIndex.value, windowType.value)
	emit('closePropUp')
};

onMounted(() => {
	getCoinList();
});
</script>

<style lang="scss" scoped>
.vant-loading {
	:deep(.van-list__loading) {
		display: none;
	}
}
</style>