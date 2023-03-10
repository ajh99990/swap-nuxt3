import Web3 from 'web3';
import tokenAbi from '~~/helper/eth/abi/erc20Abi.json';
import BigNumber from 'bignumber.js'
import useGlobalData from '~~/store/useGlobalData';
import axios from 'axios';

import { ETHChain, TRONChain } from '../chainInfo';
import { allowance, approve } from '../eth';

import { getTronAllowance, tronApprove } from '~~/helper/tron'

let payCoin, receiveCoin
// 获取允许额度
export const getSwftAllowance = async (data) => {
  const globalData = useGlobalData()
  const tradingPair = useNuxtApp().$managerScheduler.tradingPair.value
  payCoin = tradingPair.filter(item => item.type == 'pay')[0]
  receiveCoin = tradingPair.filter(item => item.type == 'receive')[0]

  if (ETHChain.includes(payCoin.chain)) {
    return await allowance(data.contractAddress, payCoin.token, globalData.ownerAddress)
  }

  if (TRONChain.includes(payCoin.chain)) {
    return await getTronAllowance(payCoin.token, data.contractAddress)
  }
}

// 将授权额度设置为最大
export const approveSwftBridge = async (data) => {
  const globalData = useGlobalData()

  if (ETHChain.includes(payCoin.chain)) {
    console.log(data.contractAddress, payCoin.token, globalData.ownerAddress);
    await approve(data.contractAddress, payCoin.token).send({ from: globalData.ownerAddress })
  }
  if (TRONChain.includes(payCoin.chain)) {
    await tronApprove(payCoin.token, data.contractAddress)
  }
}

//使用lifi bridge 进行交易
export const SwftTransaction = async (data) => {
  const globalData = useGlobalData()
  const receiveAddress = useNuxtApp().$managerScheduler.receiveAddress.value
  const slippage = useNuxtApp().$managerScheduler.slippage.value
  const params = {
    fromTokenAddress: payCoin.token == '0x000' ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' : payCoin.token,
    toTokenAddress: receiveCoin.token == '0x000' ? '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' : receiveCoin.token,
    toAddress: receiveAddress,
    amountOutMin: data.amountOutMin,
    routerPath: data.path,
    dex: data.dex,
    fromTokenChain: payCoin.chain.toUpperCase(),
    toTokenChain: receiveCoin.chain.toUpperCase(),
    fromTokenAmount: data.fromTokenAmount,
    slippage: slippage,
    source: new Date().getTime()
  }
  if (ETHChain.includes(payCoin.chain)) {
    params.equipmentNo = globalData.ownerAddress.substring(0, 32)
    params.fromAddress = globalData.ownerAddress
  }
  if (TRONChain.includes(payCoin.chain)) {
    params.equipmentNo = globalData.ownerTronAddress.substring(0, 32)
    params.fromAddress = globalData.ownerTronAddress
  }
  const result = await axios.post('https://api.paths.finance/api/commonSwap', params)
  const resultData = result.data.data.txData
  if (ETHChain.includes(payCoin.chain)) {
    const web3 = new Web3(window.ethereum)
    const gasEstimate = await web3.eth.estimateGas(transactionData)
    transactionData.gas = gasEstimate
    transactionData.gasPrice = await web3.eth.getGasPrice()
    return new Promise((resolve, reject) => {
      web3.eth.sendTransaction(transactionData)
        .on('transactionHash', function (hash) {
          resolve(hash)
        })
        .on('error', (err) => {
          reject(new Error('network error'))
        });
    })
  }
  if (TRONChain.includes(payCoin.chain)) {
    const contract = await createContract(resultData.to)
    let hash = await contract.swap(resultData.parameter[0].value, resultData.parameter[1].value, resultData.parameter[2].value, resultData.parameter[3].value, resultData.parameter[4].value).send({
      feeLimit: resultData.options.feeLimit,
      callValue: resultData.options.callValue,
      shouldPollResponse: false
    })
    return hash
  }
}