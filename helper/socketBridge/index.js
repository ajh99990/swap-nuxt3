import Web3 from 'web3';
import tokenAbi from '~~/helper/eth/abi/erc20Abi.json';
import BigNumber from 'bignumber.js'
import useGlobalData from '~~/store/useGlobalData';
import axios from 'axios';
import { allowance, approve } from '~~/helper/eth'
let socketData
// 获取sock的数据
const getSocketData = async (route) => {
  const globalData = useGlobalData()
  const slippage = useNuxtApp().$managerScheduler.slippage.value
  const useRouter = Object.assign({}, route)
  delete useRouter.bridgeMark
  const params = {
    fromAssetAddress: route.userTxs[0].steps[0].fromAsset.address,
    fromChainId: route.userTxs[0].steps[0].fromAsset.chainId,
    route: useRouter,
    sender: globalData.ownerAddress,
    toAssetAddress: route.userTxs[1] ? route.userTxs[1].toAsset.address : route.userTxs[0].toAsset.address,
    toChainId: route.userTxs[1] ? route.userTxs[1].toAsset.chainId : route.userTxs[0].toAsset.chainId,
  }
  const result = await axios.post('https://api.socket.tech/v2/route/start', params, { headers: { 'api-key': '309762cf-27b9-471b-92e7-7b382b0d6220' } })
  const activeRouteId = result.data.result.activeRouteId
  const data = await axios.get('https://api.socket.tech/v2/route/build-next-tx', { params: { activeRouteId: activeRouteId, swapSlippage: slippage }, headers: { 'api-key': '309762cf-27b9-471b-92e7-7b382b0d6220' } })
  socketData = data.data.result
}

//获取已授权的socket的额度
export const getSocketAllowance = async (route) => {
  await getSocketData(route)
  const globalData = useGlobalData()
  return await allowance(socketData.approvalData.allowanceTarget, socketData.approvalData.approvalTokenAddress, globalData.ownerAddress)
}

// 将授权额度设为最大值
export const approveSocketBridge = async () => {
  const globalData = useGlobalData()
  await approve(socketData.approveData.allowanceTarget, socketData.approvalData.approvalTokenAddress).send({ from: globalData.ownerAddress })
}

//使用socket bridge 进行交易
export const socketTransaction = async () => {
  const globalData = useGlobalData()
  const transactionData = {
    from: globalData.ownerAddress,
    to: socketData.txTarget,
    data: socketData.txData,
    value: socketData.value,
  }
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