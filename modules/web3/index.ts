import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { chainInfo } from '~~/helper/chainInfo'
import erc20Abi from './abi/erc20Abi.json'
import swapAbi from './abi/abi.json'
import swapV3Abi from './abi/v3Abi.json'

let web3:any

//等待方法的注入
const providerReady = () => {
  return new Promise((resolve, reject) => {
      const checkProvider = () => {
          if (window.ethereum) {
              resolve(window.ethereum)
          } else {
              setTimeout(() => {
                  checkProvider()
              }, 100);
          }
      }
      checkProvider()
  })
}
//获取用户的地址
export const getOwnerAddress = async (chain?:string) => {
  const provider:any = await providerReady()
  if (provider.isAssure && !provider.address) {
      return { address: '' }
  }
  web3 = new Web3(provider)
  const ownerAddress = await web3.eth.getCoinbase()
  addChain(chain)
  return ownerAddress
}
//切换到要使用的链
export const addChain = async(chain:any) => {
    const chainId = chainInfo[chain].chainId
    await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: Web3.utils.numberToHex(chainId) //链id
            }
        ]
    })
}
//获取币种的精度
export const getDecimals = async (token:string) => {
    const tokenContract = new web3.eth.Contract(erc20Abi, token)
    const decimals = await tokenContract.methods.decimals().call()
    return decimals
}
//获取币种的余额
export const getBalance = async (chain:string, token:string, isMasterCoin:boolean, ownerAddress:string) => {
    const web3 = new Web3(chainInfo[chain].rpc)
    if (isMasterCoin) {
        const balance = await web3.eth.getBalance(ownerAddress)
        return BigNumber(balance).shiftedBy(-18)
    } else {
        const tokenContract = new web3.eth.Contract(erc20Abi, token)
        const balance = await tokenContract.methods.balanceOf(ownerAddress).call()
        const decimals = await tokenContract.methods.decimals().call()
        return BigNumber(balance).shiftedBy(-decimals)
    }
}
//买入框输入金额
export const swapExactTokensForTokens = (chain:string, contract:string, coin0:string, coin1:string, coin2:string, coin3:string, route0:string, route1:string, route2:string, amountIn:string, amountMinOut:string, to:string, deadline:string, peeList:any, V3:boolean) => {
    if (V3) {
        const swapContract = new web3.eth.Contract(swapV3Abi, contract)
        return swapContract.methods.swapExactTokensForTokens(coin0, peeList[0].fee, coin1, peeList[1].fee, coin2, peeList[2].fee, coin3, route0, amountIn, amountMinOut, to, deadline)
    } else {
        const swapContract = new web3.eth.Contract(swapAbi, contract)
        return swapContract.methods.swapExactTokensForTokens(coin0, coin1, coin2, coin3, route0, route1, route2, amountIn, amountMinOut, to, deadline)
    }
}
//接收框输入金额
export const swapTokensForExactTokens = (chain:string, contract:string, coin0:string, coin1:string, coin2:string, coin3:string, route0:string, route1:string, route2:string, amountInMax:string, amountOut:string, to:string, deadline:string, peeList:any, V3:boolean) => {
    if (V3) {
        const swapContract = new web3.eth.Contract(swapV3Abi, contract)
        return swapContract.methods.swapTokensForExactTokens(coin0, peeList[0].fee, coin1, peeList[1].fee, coin2, peeList[2].fee, coin3, route0, amountInMax, amountOut, to, deadline)
    } else {
        const swapContract = new web3.eth.Contract(swapAbi, contract)
        return swapContract.methods.swapTokensForExactTokens(coin0, coin1, coin2, coin3, route0, route1, route2, amountInMax, amountOut, to, deadline)
    }
}
// 目前币种已授权的额度
export const allowance = async (chain:string , swapContractAddress:string, tokenContractAddress:string, ownerAddress:string) => {
    const tokenContract = new web3.eth.Contract(erc20Abi, tokenContractAddress)
    try {
        const result = await tokenContract.methods.allowance(ownerAddress, swapContractAddress).call()
        return result
    } catch (error) {
        console.error({ title: 'allowance error' })
    }
}
//获取gasPrice
export const getGasPrice = async () => {
    const data = await web3.eth.getGasPrice()
    return data
}
//对币种额度进行授权
export const approve = (chain:string, swapContractAddress:string, tokenContractAddress:string) => {
    const tokenContract = new web3.eth.Contract(erc20Abi, tokenContractAddress)
    const totalSupply = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    return tokenContract.methods.approve(swapContractAddress, totalSupply)
}
//校验用户输入的地址
export const checkAddress = async (address:string) => {
    web3 = new Web3(window.ethereum)
    const state = web3.utils.isAddress(address)
    return state
}