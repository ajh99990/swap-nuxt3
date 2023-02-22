import useGlobalData from "~~/store/useGlobalData"
import useBaseApi from "~~/api/useBaseApi/index"
import BigNumber from "bignumber.js"
import { chainInfo } from "~~/helper/chainInfo"
import useJudgeFun from "./judgeFun"
import { getStringNum } from "../../../helper/common"
import { getTokenBalanceByBatch } from "../../../helper/eth/getMulticallInfo"

const globalData = useGlobalData()
const baseApi = useBaseApi()
const allChain = Object.keys(chainInfo)

const toUSDTArray = async (coinList) => {
  if (coinList instanceof Array) {
    let params = []
    coinList.map(item => {
      params.push(item.chain + "_" + item.token)
    })
    return await baseApi.post(({ api }) => {
      return {
        api: api.getCoinPrice,
        onlySend: true,
        data: params,
      };
    });
  }
}

const filterCoins = (type, coinList) => {
  const privateChain = Object.keys(globalData.appChainsInfo)
  const allChainObj = {}
  if (type == 'history') {
    coinList = coinList.filter(item => privateChain.includes(item.chain))
  }
  allChain.map(i => {
    allChainObj[i] = coinList ? coinList.filter(o => o.chain == i) : []
  })
  return allChainObj
}

const finishMasterCoin = async (list, index, rateUSDT) => {
  const masterCoin = list.filter(i => i.token == '0x000')
  if (masterCoin.length) {
    masterCoin[0].totalAmount = getStringNum(BigNumber(await useJudgeFun(allChain[index], '0x000')).toNumber())
    masterCoin[0].balance = getStringNum(Number(masterCoin[0].totalAmount) * rateUSDT[`${masterCoin[0].chain}_${masterCoin[0].token}`], 2)
  }
  return masterCoin
}

const finishOthersCoin = async (list, index, rateUSDT) => {
  const otherCoins = list.filter(i => i.token != '0x000')
  const otherCoinTokens = otherCoins.map(item => {
    return item.token
  })
  const othersAmount = await useJudgeFun(allChain[index], otherCoinTokens)
  otherCoins.forEach((item, index) => {
    item.totalAmount = getStringNum(othersAmount[index])
    item.balance = getStringNum(item.totalAmount * rateUSDT[`${item.chain}_${item.token}`], 2)
  })
  return otherCoins
}

const getAmountBalance = async (list, index, rateUSDT) => {
  if (!list.length) return []
  const masterCoin = await finishMasterCoin(list, index, rateUSDT)
  const otherCoins = await finishOthersCoin(list, index, rateUSDT)
  return orderByCoins(masterCoin, otherCoins)
}

const orderByCoins = (masterCoin, otherCoins) => {
  otherCoins = otherCoins.sort((a, b) => {
    return b.balance - a.balance
  })
  const fixedOrder = otherCoins.filter(item => item.balance > 0)
  const needOrder = otherCoins.filter(item => item.balance == 0).sort((a, b) => {
    return b.totalAmount - a.totalAmount
  })
  return masterCoin.concat(fixedOrder).concat(needOrder)
}

export const coinSort = async (type, coinList) => {
  const allChainObj = filterCoins(type, coinList)
  const rateUSDT = await toUSDTArray(coinList)
  const promises = Object.values(allChainObj).map((list, index) => {
    return getAmountBalance(list, index, rateUSDT)
  })
  const finishCoinList = await Promise.all(promises)
  if (type == 'history' || type == "allChain") {
    return orderByCoins([], finishCoinList.flat())
  } else {
    return finishCoinList.flat()
  }
}