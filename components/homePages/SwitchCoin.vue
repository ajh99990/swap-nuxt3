<template>
	<div>
		<PopUps propHeight="600px" popupTitle="选择币种" :showState="popupState">
			<div class="border-b-1px border-b-[#E6EAF5] border-solid">
				<van-search class="search_style" v-model="searchVal" @clear="clearInput" :placeholder="$t('home.contractAddress')">
					<template v-slot:left-icon>
						<img src="@/assets/images/home/icon_search.png" class="w-16px mt-4px mr-4px" alt />
					</template>
				</van-search>
			</div>
			<div class="flex">
				<div></div>
				<div></div>
			</div>
		</PopUps>
	</div>
</template>

<script setup>
const props = defineProps({
	popupState: Boolean,
});
const searchVal = ref("");

const clearInput = () => {};
</script>

<style lang="scss" scoped>
.search_style {
	--van-search-content-background-color: #f5f6fa;
	// input ::-webkit-input-placeholder {
	// 	color: skyblue;
	// }
	::v-deep .van-search__content {
		border-radius: 8px;
	}
	::v-deep .van-field__control::-webkit-input-placeholder {
		color: #7e84a3;
	}
}
</style>
