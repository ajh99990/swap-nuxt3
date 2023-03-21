<template>
	<div class="bg-[#f5f6fa] h-100vh overflow-y-auto" id="listContent">
		<div class="w-375px h-48px bg-[#FFF] flex justify-between px-15px pb-12px pt-16px z-5000 fixed">
			<div class="text-14px leading-20px flex items-center" v-for="item in typeArray" :key="item.value">
				<p class="text-[#7e84a3] mr-15px">{{ item.label }}</p>
				<div @click="changeType(item.value)" class="flex items-center">
					<p class="text-[#191e35] mr-4px">{{ item.value == 'state' ? stateArray[selectedStateIndex].label : timeArray[selectedTimeIndex].label }}</p>
					<img :class="showType == item.value && showTop ? '-rotate-180' : ''" class="w-16px h-16px transform duration-150" src="~~/assets/images/arrowDown.png" />
				</div>
			</div>
		</div>
		<TradeListVue :stateCode="stateArray[selectedStateIndex].value" :timeCode="timeArray[selectedTimeIndex].value" />
		<van-popup v-model:show="showTop" :transition-appear="true" duration="0.2" round position="top">
			<div class="w-375px mt-48px border-t-12px border-[#f5f6fa] border-solid px-15px pt-16px pb-6px flex flex-wrap">
				<div v-for=" (item,index) in showArray" :key="index" @click="changeSelect(index)" :class="indexNum == index ? 'text-[#597BF6] font-500' : 'text-minor '" class="box-item w-108px h-32px bg-[#F6F6F6] text-center leading-32px rounded-8px mb-10px">{{item.label}}</div>
			</div>
		</van-popup>
	</div>
</template>

<script setup>
import TradeListVue from "../modules/tradeRecord/TradeList.vue";
import useGlobalData from "~~/store/useGlobalData";

onBeforeRouteUpdate((to, from) => {
	const globalData = useGlobalData();
	const title = globalData.language == "zh" ? "交易记录" : "Exchange History";
	document.title = title;
	postMessageApp(
		"setTitle",
		JSON.stringify({
			title,
		})
	);
});

const { t } = useI18n();
const typeArray = [
	{ label: t("Status"), value: "state" },
	{ label: t("Duration"), value: "time" },
];
const stateArray = [
	{ label: t("All"), value: "" },
	{ label: t("tradeSuccess"), value: "trade_success" },
	{ label: t("tradeInProgress"), value: "proccessing" },
	{ label: t("tradeFailed"), value: "trade_fail" },
];
const timeArray = [
	{ label: t("All"), value: "" },
	{ label: t("LastMonth"), value: "1" },
	{ label: t("Last3Months"), value: "2" },
	{ label: t("Last6Months"), value: "3" },
	{ label: t("lastYarn"), value: "4" },
];

const showTop = ref(false);
const showType = ref("");
const showArray = ref([]);
const indexNum = ref(0);

const selectedStateIndex = ref(0);
const selectedTimeIndex = ref(0);
const changeSelect = (index) => {
	indexNum.value = index;
	if (showType.value == "state") {
		selectedStateIndex.value = index;
	} else {
		selectedTimeIndex.value = index;
	}
	showTop.value = false;
	document.getElementById("listContent").scrollTo(0, 0);
};

watch(
	() => showType.value,
	(newVal) => {
		indexNum.value =
			newVal == "state"
				? selectedStateIndex.value
				: selectedTimeIndex.value;
	}
);

const changeType = (val) => {
	if (showType.value != val) {
		showType.value = val;
		showArray.value = val == "state" ? stateArray : timeArray;
		showTop.value = true;
	} else {
		showTop.value = !showTop.value;
	}
};
</script>

<style lang="scss" scoped>
.box-item {
	margin-right: 10px;
}
.box-item:nth-child(3n + 3) {
	margin-right: 0px !important;
}
</style>