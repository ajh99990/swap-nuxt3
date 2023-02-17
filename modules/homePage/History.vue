<template>
	<div v-if="historyList.length && showHistory" class="w-343px fixed bottom-45px py-13px">
		<div class="flex justify-between py-1">
			<p class="flex items-center">
				<span class="text-12px text-minor">{{ $t('homeRecently') }}</span>
			</p>
			<img src="@/assets/images/homehistoryDelete.png" @click="deleteHistory('1')" class="h-14px w-14px" />
		</div>
		<div class="w-343px py-9px overflow-y-auto">
			<div class="h-100px flex">
				<div v-for="(item, index) in historyList" :key="index" @click="newTransaction(item)" class="bg-[#F5F6FA] p-10px rounded-12px flex flex-col w-109px h-96px mr-9px relative flex-shrink-0">
					<div class="flex mb-18px items-center">
						<Images :logo="item.token0_logo" logoWidth="24px" :logoName="item.symbol0" :smallCoin="true" class="mr-8px flex-shrink-0" />
						<p>
							<p class="text-14px leading-16px font-400 text-[#191E35] truncate w-54px">{{item.symbol0}}</p>
							<p class="text-12px leading-14px text-[#909AB5] truncate w-60px">{{ chainInfo[item.token0_chain].fullName }}</p>
						</p>
					</div>
					<img src="@/assets/images/homeHistoryArrow.png" class="w-13px absolute left-14px top-41px"/>
					<div class="flex flex-shrink-1 items-center truncate">
						<Images :logo="item.token1_logo" logoWidth="24px" :logoName="item.symbol1" :smallCoin="true" class="mr-8px flex-shrink-0" />
						<p>
							<p class="text-14px leading-16px font-400 text-[#191E35] truncate w-54px">{{item.symbol1}}</p>
							<p class="text-12px leading-14px text-[#909AB5] truncate w-60px">{{ chainInfo[item.token1_chain].fullName }}</p>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { chainInfo } from "~~/helper/chainInfo";
import useBaseApi from "@/api/useBaseApi"
import useGlobalData from "~~/store/useGlobalData"

const baseApi = useBaseApi()
const globalData = useGlobalData()
const historyList = ref([])

const showHistory = computed(()=>{
	return useNuxtApp().$managerScheduler.showHistory.value
})

const getRecentList = ()=> {
	baseApi.get(({ api }) => {
      return {
        api: api.getHistorySwap,
        params:{
          chain: globalData.presentChain,
          address: globalData.ownerAddress
        },
        success: (res, config) => {
          historyList.value = res
        }
      }
    })
}

const deleteHistory = () => {
    baseApi.delete(({ api }) => {
      return {
        api: api.delHistorySwap,
        data:{
          chain: globalData.presentChain,
          address: globalData.ownerAddress
        },
        success: () => {
          historyList.value = []
        }
      }
    }) 
  }

const newTransaction = (trade) => {
	console.log(trade);
};

onMounted(()=>{
	getRecentList()
})

</script>

<style lang="scss" scoped>
</style>