import Web3 from 'web3';
import tokenAbi from '~~/helper/eth/abi/erc20Abi.json';
import BigNumber from 'bignumber.js'
import useGlobalData from '~~/store/useGlobalData';
import axios from 'axios';

import { allowance, approve } from '~~/helper/eth'
// 获取允许额度
export const getLifiAllowance = async (coinToken) => {
  const globalData = useGlobalData()
  return await allowance('0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE', coinToken, globalData.ownerAddress)
}

// 将授权额度设置为最大
export const approveLifiBridge = async (coinToken) => {
  const globalData = useGlobalData()
  await approve('0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE', coinToken).send({ from: globalData.ownerAddress })
}

//使用lifi bridge 进行交易
export const lifiTransaction = async (chosenRoute) => {
  const globalData = useGlobalData()
  const receiveAddress = useNuxtApp().$managerScheduler.receiveAddress.value
  const params = {
    id: chosenRoute.id,
    type: chosenRoute.steps[0].type,
    tool: chosenRoute.steps[0].tool,
    action: chosenRoute.steps[0].action,
    estimate: chosenRoute.steps[0].estimate,
    integrator: 'AssureWallet',
    referrer: '',
    includedSteps: chosenRoute.steps[0].includedSteps,
    toolDetails: chosenRoute.steps[0].toolDetails
  }
  params.action.fromAddress = globalData.ownerAddress
  params.action.toAddress = receiveAddress
  const result = await axios.post('https://li.quest/v1/advanced/stepTransaction', params)
  const transactionData = result.data.transactionRequest
  delete transactionData.chainId
  const web3 = new Web3(window.ethereum)
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