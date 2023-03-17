import { Coins, chainInfo } from "~~/helper/chainInfo";
import useGlobalData from "~~/store/useGlobalData";
import useGoplusApi from "~~/api/useGoPlusApi";
import { ETHChain, TRONChain } from "~~/helper/chainInfo";
import { swapExactTokensForTokens, swapTokensForExactTokens, allowance, approve, getGasPrice } from "~~/helper/eth";
import { getTronGasLimit, getTronAllowance, getApproveLimit, tronApprove, getTronContract } from "~~/helper/tron";
import { getLifiAllowance, approveLifiBridge,lifiTransaction } from "~~/helper/lifiBridge";
import { getSocketAllowance, approveSocketBridge, socketTransaction } from "~~/helper/socketBridge";
import { getSwftAllowance, approveSwftBridge, swftTransaction } from "~~/helper/swftBridge";
import BigNumber from "bignumber.js";
import useBaseApi from "~~/api/useBaseApi";

//判断当前的链是否支持
export function checkChain(chain:string): boolean {
    const globalData = useGlobalData()
    const keys = Object.keys(globalData.appChainsInfo)
    return !keys.includes(chain)
}

//获取当前要使用的交易对中的币种 ----> 因为是一行代码的工具函数 少部分在使用 大多数都是直接复写当前函数内的代码
export function getUseCoin (tradingPair:Coins[], type:string) {
    return tradingPair.filter(item => item.type == type)[0]
}   

//调用GoPlus接口 与下面的 getDangerNum 方法配合使用  ---->GoPlus第三方接口
async function showErrorStyle (chain:string, token:string) {
    const goplusApi = useGoplusApi()
    const chainId = ETHChain.includes(chain) ? chainInfo[chain].chainId : chain
    const data = await goplusApi.get(({ api }) => {
        return {
          api: api.tokenSecurity,
          params:{
            contract_addresses: token,
          },
          routeParams:{
            chainId: chainId
          }
        }
      }) 
    return data[token]
}
  
//获取合约检测危险数量
const dangerProp = ["is_honeypot"];
const whiteList = ["0xdac17f958d2ee523a2206206994597c13d831ec7"]
export const getDangerNum = async (chain:string, token:string,) => {
    if (whiteList.includes(token) || token == '0x000') return 0
    const data:any = await showErrorStyle(chain, token)
    let danger = dangerProp, score = 0
    danger.forEach((item) => {
        if (item.includes("_reverse")) {
        score += Number(data?.[item.replace("_reverse", "")]) || 0;
        } else {
        score += Number(data?.[item]) || 0;
        }
    });
    score += Number(data?.buy_tax) >= 0.2 ? 1 : 0;
    score += Number(data?.sell_tax) >= 0.2 ? 1 : 0;
    return score
};


//<=============== 单链交易时需要的一些方法 按照交易流程从上往下 （目前 类以太、波场） ===================>
//组装调用合约需要的参数
let contractParams:any, webContract:any
export const getContractParams = (chain:string, data:any, operateType:string)=>{
  const receiveAddress:string = useNuxtApp().$managerScheduler.receiveAddress.value
  const slippage:string = useNuxtApp().$managerScheduler.slippage.value

  if(ETHChain.includes(chain)){
    console.log('类以太单链交易合约参数');
    let timer = new Date().getTime() + 3 * 60 * 60;
    const params = [
      data.contractAddress,
      data.firstRouteList[0].token,
      data.firstRouteList[1].token,
      data.firstRouteList[2].token,
      data.firstRouteList[3].token,
      data.name == "univ3_swap"
        ? data.routeAddress
        : data.routeList[0],
      data.name == "univ3_swap"
        ? data.routeAddress
        : data.routeList[1],
      data.name == "univ3_swap"
        ? data.routeAddress
        : data.routeList[2],
      data.amountIn,
      Math.ceil((Number(data.amountOut) * (100 - Number(slippage)))/100) + '',
      receiveAddress,
      timer,
    ];
    
    if (operateType == "receive") {
      params[8] = Math.floor((Number(data.amountIn) * (100 + Number(slippage)))/100) + '';
      params[9] = data.amountOut;
    }
    if(data?.name == 'univ3_swap') {
      params[11] = data.feeList
      params[12] = true
    }
    contractParams = params
  }

  if(TRONChain.includes(chain)) {
    console.log('波场单链交易合约参数');
    const params = [
      data.firstRouteList[0].token,
      data.firstRouteList[1].token,
      data.firstRouteList[2].token,
      data.firstRouteList[3].token,
      data.routeList[0],
      data.routeList[1],
      data.routeList[2],
      data.amountIn,
      Math.ceil((data.amountOut * (100 - Number(slippage))) /
      100) + '',
      receiveAddress,
      (new Date().getTime() + 3 * 60 * 60).toString(),
    ];
    if (operateType == "receive") {
      params[7] = Math.floor((data.amountIn * (100 + Number(slippage))) /
      100) + '';
      params[8] = data.amountOut;
    }
    contractParams = params;
  }
}

//获取给当前合约授权的额度
export const getAllowance = async (chain:string, coinToken:string, contractAddress:string )=> {
  const globalData = useGlobalData()
  let allowanceNum, userAddress
  
  if(ETHChain.includes(chain)){
    userAddress = globalData.ownerAddress
    allowanceNum = await allowance(contractAddress, coinToken, userAddress)
  }

  if(TRONChain.includes(chain)) {
    allowanceNum = await getTronAllowance(coinToken, contractAddress)
  }

  return allowanceNum
}

//根据estimate是返回手续费还是调用授权
export const toApprove = async (chain:string, coinToken:string, contractAddress:string, estimate:boolean)=>{
  const globalData = useGlobalData()
  let userAddress 
  if(ETHChain.includes(chain)){
    userAddress = globalData.ownerAddress
    if(estimate){
      return await approve(contractAddress, coinToken).estimateGas({
        from: userAddress
      })
    } else {
      await approve(contractAddress, coinToken).send({
        from: userAddress
      })
    }
  }
  if(TRONChain.includes(chain)) {
    userAddress = globalData.ownerTronAddress
    if(estimate){
      return await getApproveLimit(coinToken, contractAddress)
    } else {
      await tronApprove(coinToken, contractAddress)
    }
  }
}

//创建合约
const createContract = async (chain:string, data:any ,operateType:string) => {
  getContractParams(chain, data, operateType)

  if(ETHChain.includes(chain)){
    const webContract = operateType == 'pay' ? swapExactTokensForTokens(...contractParams) : swapTokensForExactTokens(...contractParams)
    return webContract
  }

  if(TRONChain.includes(chain)) {
    const webContract = await getTronContract(data.contractAddress)
    return webContract
  }
}

//获取预估的gasLimit
export const getEstimateGas = async (chain:string, data:any, payCoinToken:string, operateType:string) => {
  const globalData = useGlobalData()

  if(ETHChain.includes(chain)){
    const gasPrice = await getGasPrice()
    const userAddress = globalData.ownerAddress
    webContract = await createContract(chain, data, operateType)
  
    const estimateGas = await webContract.estimateGas({
      gas: gasPrice,
      from: userAddress,
      value: payCoinToken == '0x000' ? contractParams[8] + '' :''
    })
    return estimateGas
  }

  if(TRONChain.includes(chain)) {
    webContract = await createContract(chain, data, operateType)
    return await getTronGasLimit(data)
  }
}

//调用合约获取hash
export const transactions = async (chain:string, payCoinToken:string, gasPrice:number|string, gas:number) => {
  const globalData = useGlobalData()

  if(ETHChain.includes(chain)){
    const userAddress = globalData.ownerAddress
    let params = {
      gasPrice: gasPrice,
      gas: gas,
      from: userAddress,
      value: payCoinToken == '0x000' ? contractParams[8] + '' :''
    }
    return new Promise((resolve, reject) => {
      webContract.send(params)
      .on('transactionHash', function(hash:string){
        resolve(hash)
      }).on('error',(err:any)=>{
        reject(err)
      })
    })

  }

  if(TRONChain.includes(chain)) {
    const operateType:string = useNuxtApp().$managerScheduler.operateType.value

    if(operateType == 'pay'){
     return await webContract.swapExactTokensForTokens(...contractParams).send({
        feeLimit: Number(gasPrice) * Number(gas),
        callValue: payCoinToken == '0x000' ? contractParams[7] : 0,
        shouldPollResponse: false,
    })
    } else {
      return await webContract.swapTokensForExactTokens(...contractParams).send({
        feeLimit: Number(gasPrice) * Number(gas),
        callValue: payCoinToken == '0x000' ? contractParams[7] : 0,
        shouldPollResponse: false,
    })
    }
    
  }
}
//<=============== Done  ===================>

//<=============== 跨链交易时需要的一些方法 按照交易流程从上往下 （目前 lifi、socket、swft） ===================>

export const getCrossAllowance = async (data:any)=>{

  if(data.bridgeMark == 'LIFI'){
    return await getLifiAllowance(data.fromToken.address)
  } 
  if(data.bridgeMark == 'SOCKET'){
    return await getSocketAllowance(data)
  }
  if(data.bridgeMark == 'SWFT'){
    return await getSwftAllowance(data)
  }
}

export const approveCrossBridge = async (data:any) => {
  if(data.bridgeMark == 'LIFI'){
    await  approveLifiBridge(data.fromToken.address)
  } 
  if(data.bridgeMark == 'SOCKET'){
    await approveSocketBridge()
  }
  if(data.bridgeMark == 'SWFT'){
    await approveSwftBridge(data)
  }
}

export const crossTransactions = async (data:any) => {
  if(data.bridgeMark == 'LIFI'){
    return await lifiTransaction(data)
  } 

  if(data.bridgeMark == 'SOCKET'){
    return await socketTransaction()
  }

  if(data.bridgeMark == 'SWFT'){
    return await swftTransaction(data)
  }
}
//<=============== Done  ===================>


//<=============== 向后端提交hash时对数据做的一些整理 ===================>

export const getSubmitAmount = (crossChain:boolean, data:any) => {
  console.log(data);
  
  let amountObject = {
    payAmount: '',
    receiveAmount: ''
  }
  if(crossChain){
    if(data.bridgeMark == 'LIFI' || data.bridgeMark == 'SOCKET'){
      amountObject.payAmount = data.fromAmount
      amountObject.receiveAmount = data.toAmount
    }
    if(data.bridgeMark == 'SWFT'){
      amountObject.payAmount = data.fromTokenAmount
      amountObject.receiveAmount = data.amountOutMin
    }
  } else {
    amountObject.payAmount = data.amountIn
    amountObject.receiveAmount = data.amountOut
  }
  console.log(amountObject);
  return amountObject
}

export const getCrossData = async (data:any, receiveCoin:Coins) => {
  let crossData = {
    fee: '',
    feeUsdt: '',
    feeToken: '',
    bridgeKey: '',
  }
  
  if(data.bridgeMark == 'LIFI'){
    const feeData = getCostFee(data.steps[0].estimate.feeCosts);
    crossData.fee = feeData.fee
    crossData.feeUsdt = feeData.feeUsdt
    crossData.feeToken = feeData.feeToken
    crossData.bridgeKey = data.steps[0].tool
  }

  if(data.bridgeMark == 'SOCKET' || data.bridgeMark == 'SWFT'){
    const baseApi = useBaseApi()
    const Str = `${receiveCoin.chain}_${receiveCoin.token}`
    const receiveToUsdt = await baseApi.post(({ api }) => {
      return {
        api: api.getCoinPrice,
        data: [Str],
      };
    });

    if(data.bridgeMark == 'SOCKET'){
      crossData.fee = data.integratorFee.amount
      crossData.feeUsdt = BigNumber(data.integratorFee.amount).shiftedBy(-data.integratorFee.asset.decimals).times(receiveToUsdt[Str]).toString()
      crossData.feeToken = data.integratorFee.asset.address
      crossData.bridgeKey = data.userTxs[0].steps[0].type == "bridge" ? data.userTxs[0].steps[0].protocol.name : data.userTxs[0].steps[1].protocol.name
    }
    if(data.bridgeMark == 'SWFT'){
      crossData.fee = BigNumber(data.chainFee).shiftedBy(receiveCoin.decimals).toString()
      crossData.feeUsdt = BigNumber(data.chainFee).times(receiveToUsdt[Str]).toString()
      crossData.feeToken = receiveCoin.token
      crossData.bridgeKey = data.dex
    }
  }

  return crossData
}

const getCostFee = (data:any[]) => {
  const feeData = data.filter(item => item.name == 'Integrator Fee')[0]
  const fee = feeData.amount
  const x = Number(BigNumber(feeData.amount).shiftedBy(-feeData.token.decimals).toString())
  const feeUsdt = BigNumber(x).multipliedBy(feeData.token.priceUSD).toString()
  const feeToken = feeData.token.address
  const exportData = { feeUsdt, feeToken, fee }
  return exportData
}



//<=============== Done ===================>