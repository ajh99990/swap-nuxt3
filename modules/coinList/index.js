import useGlobalData from "~~/store/useGlobalData"
import useBaseApi from "~~/api/useBaseApi"
import BigNumber from "bignumber.js"
import { chainInfo } from "~~/helper/chainInfo"
import { getBalance } from "../web3"
import { getStringNum } from "../common"
import { getTokenBalanceByBatch } from "../web3/getMulticallInfo"

const globalData = useGlobalData()
const baseApi = useBaseApi()

const toUSDTArray = async (coinList) => {
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

export const coinSort = async (type, coinList) => {
  const privateChain = Object.keys(globalData.appChainsInfo)
  const rateUSDT = await toUSDTArray(coinList)
  const allChain = Object.keys(chainInfo)
  const allChainObj = {}
  if (type == 'history') {
    coinList = coinList.filter(item => privateChain.includes(item.chain))
  }
  allChain.map(i => {
    allChainObj[i] = coinList.filter(o => o.chain == i)
  })
  const promises = Object.values(allChainObj).map(async (list, index) => {
    if (!list.length) return
    const masterCoin = list.filter(i => i.token == '0x000')
    if (masterCoin.length) {
      masterCoin[0].totalAmount = getStringNum((await getBalance(allChain[index], '0x000', true, globalData.ownerAddress)).toNumber())
      masterCoin[0].balance = getStringNum(Number(masterCoin[0].totalAmount) * rateUSDT[`${masterCoin[0].chain}_${masterCoin[0].token}`], 2)
    }
    const otherCoins = list.filter(i => i.token != '0x000')
    const otherCoinTokens = otherCoins.map(item => {
      return item.token
    })
    const othersAmount = await getTokenBalanceByBatch(allChain[index], otherCoinTokens, globalData.ownerAddress)
    otherCoins.forEach((item, index) => {
      item.totalAmount = getStringNum(othersAmount[index])
      item.balance = getStringNum(item.totalAmount * rateUSDT[`${item.chain}_${item.token}`], 2)
    })
    const orderByBalance = otherCoins.sort((a, b) => {
      return b.balance - a.balance
    })
    const firstArray = orderByBalance.filter(item => item.balance > 0)
    const lastArray = orderByBalance.filter(item => item.balance = 0).sort((a, b) => {
      return b.totalAmount - a.totalAmount
    })
    return masterCoin.concat(firstArray).concat(lastArray)
  })

  const coinList = await Promise.all(promises)

  return coinList
}