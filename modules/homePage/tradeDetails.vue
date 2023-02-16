<template>
	<div v-if="showDetail" class="mt-22px">
		<Line v-if="detailInfo.routeName" :label="$t('routeName')" class="mb-10px">
			<img :src="detailInfo.routeLogo" class="mr-6px h-22px rounded-full" />
			<span class="mr-4px">{{ detailInfo.routeName }}</span>
			<img src="~~/assets/images/rightArrow.png" class="w-15px h-15px" />
		</Line>
		<Line v-else :label="$t('bestChannel')" class="mb-10px">
			<img :src="detailInfo.platform" class="h-22px mr-19px" />
		</Line>
		<div v-if="detailInfo.routeName" class="bg-[#f7f9fe] px-14px py-10px mb-10px">
			<Line :label="$t('GasFee')" class="mb-10px">
				<span class="mr-5px">$ {{ detailInfo.GasFee }}</span>
			</Line>
			<Line :label="$t('swapTime')">
				<span class="mr-5px">~{{ detailInfo.swapTime }}</span>
			</Line>
		</div>
		<Line :label="$t('Slippage')" class="mb-10px">
			<span class="mr-4px">{{ detailInfo.slippage * 100 }} %</span>
			<img src="~~/assets/images/setSlippage.png" class="w-15px h-15px" />
		</Line>
		<div v-if=" !detailInfo.routeName ">
			<Line :label="$t('youSave')" class="mb-10px">
				<span class="pr-19px">$ {{ detailInfo.youSave }}</span>
			</Line>
			<Line v-if="detailInfo.priceImpact" :label="$t('PriceImpact')" class="mb-10px">
				<span class="pr-19px">{{ detailInfo.priceImpact }}</span>
			</Line>
		</div>
		<Line :label="$t('TX.Fee')" class="mb-10px">
			<span class="pr-19px">{{ detailInfo.TXFee }}</span>
		</Line>
		<Line :label="$t('ReceivingAddress')" class="mb-10px">
			<span class="mr-4px">{{ detailInfo.receivingAddress }}</span>
			<img src="~~/assets/images/setAddress.png" class="w-15px h-15px" />
		</Line>
	</div>
</template>

<script setup>
import Line from "./commons/line.vue";

const detailInfo = computed(() => {
	return useNuxtApp().$managerScheduler.transactionDetails.value;
});

const showDetail = computed(() => {
	return useNuxtApp().$managerScheduler.showDetail.value;
});
</script>

<style lang="scss" scoped>
</style>