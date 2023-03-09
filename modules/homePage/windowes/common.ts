import { Coins, chainInfo } from "~~/helper/chainInfo";
import useGlobalData from "~~/store/useGlobalData";
import useGoplusApi from "~~/api/useGoPlusApi";
import { ETHChain, TRONChain } from "~~/helper/chainInfo";
import { swapExactTokensForTokens, swapTokensForExactTokens, allowance, approve, getGasPrice } from "~~/helper/eth";


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
    score += Number(data?.buy_tax) >= 0.5 ? 1 : 0;
    score += Number(data?.sell_tax) >= 0.5 ? 1 : 0;
    return score
};


//<=============== 单链交易时需要的一些方法 按照交易流程从上往下 （目前 类以太、波场） ===================>
//组装调用合约需要的参数
let contractParams:any, webContract:any
export const getContractParams = (chain:string, data:any, operateType:string)=>{
  const receiveAddress:string = useNuxtApp().$managerScheduler.receiveAddress.value
  const slippage:string = useNuxtApp().$managerScheduler.slippage.value
  console.log(slippage);
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
    console.log('波场单链交易合约参数');
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
  }
}

//创建合约
const createContract = (chain:string, data:any) => {
  const operateType:string = useNuxtApp().$managerScheduler.operateType.value
  getContractParams(chain, data, operateType)

  if(ETHChain.includes(chain)){
    const webContract = operateType == 'pay' ? swapExactTokensForTokens(...contractParams) : swapTokensForExactTokens(...contractParams)
    return webContract
  }

  if(TRONChain.includes(chain)) {

  }
}

export const getEstimateGas = async (chain:string, data:any, payCoinToken:string) => {
  const globalData = useGlobalData()

  if(ETHChain.includes(chain)){
    const gasPrice = await getGasPrice()
    const userAddress = globalData.ownerAddress
    webContract = createContract(chain, data)
  
    const estimateGas = await webContract.estimateGas({
      gas: gasPrice,
      from: userAddress,
      value: payCoinToken == '0x000' ? contractParams[8] + '' :''
    })
    return estimateGas
  }

  if(TRONChain.includes(chain)) {

  }

  
}


export const transactions = async (chain:string, data:any, payCoinToken:string, gasPrice:number|string, gas:number) => {
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
  }
}


//<=============== Done  ===================>
