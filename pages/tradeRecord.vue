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

// definePageMeta({
// 	keepalive: {
// 		include: "tradeRecord",
// 	},
// });
const typeArray = [
	{ label: "交易状态", value: "state" },
	{ label: "交易时间", value: "time" },
];
const stateArray = [
	{ label: "全部", value: "" },
	{ label: "交易成功", value: "trade_success" },
	{ label: "交易中", value: "proccessing" },
	{ label: "交易失败", value: "trade_fail" },
];
const timeArray = [
	{ label: "全部", value: "" },
	{ label: "近1月", value: "1" },
	{ label: "近3月", value: "2" },
	{ label: "近半年", value: "3" },
	{ label: "近1年", value: "4" },
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

onMounted(() => {});

onActivated(() => {
	document.getElementById("listContent").scrollTo(100, 0);
});
</script>

<style lang="scss" scoped>
.box-item {
	margin-right: 10px;
}
.box-item:nth-child(3n + 3) {
	margin-right: 0px !important;
}
</style>