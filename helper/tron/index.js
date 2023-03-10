import BigNumber from "bignumber.js";
import Web3 from 'web3';
import swapAbi from '../eth/abi/abi.json'
import tokenAbi from '../eth/abi/erc20Abi.json';
import axios from "axios";
import useGlobalData from "~~/store/useGlobalData";

const ethRpc = "https://api.trongrid.io/jsonrpc"

let Tron, ownerTronAddress

//等待tronweb的注入
const providerTronReady = () => {
    return new Promise((resolve, reject) => {
        const checkProvider = () => {
            if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
                resolve(window.tronWeb)
            } else {
                setTimeout(() => {
                    checkProvider()
                }, 100);
            }
        }
        checkProvider()
    })
}

//获取用户trom地址
export const getTronAddress = async () => {
    Tron = await providerTronReady()
    ownerTronAddress = Tron.defaultAddress.base58
    return ownerTronAddress
}

//获取tron币种余额
export const getTronCoinBalance = async (token) => {
    const hexAddress = Tron.address.toHex(ownerTronAddress).slice(2)
    if (token instanceof Array) {
        let priceParams = []
        let decimalsParams = []
        token.map(item => {
            priceParams.push({
                id: 1,
                jsonrpc: "2.0",
                method: "eth_call",
                params: [
                    {
                        data: `0x70a08231000000000000000000000000${hexAddress}`,
                        to: Tron.address.toHex(item),
                    },
                    "latest",
                ],
            })
            decimalsParams.push({
                id: 2,
                jsonrpc: "2.0",
                method: "eth_call",
                params: [
                    {
                        data: `0x313ce567`,
                        to: Tron.address.toHex(item),
                    },
                    "latest",
                ],
            })
        })
        const priceRes = await axios.post("https://api.trongrid.io/jsonrpc", priceParams)
        const decimalsRes = await axios.post("https://api.trongrid.io/jsonrpc", decimalsParams)

        const numberArray = priceRes.data.map((item, index) => {
            return BigNumber(BigNumber(item.result)).shiftedBy(-BigNumber(decimalsRes.data[index].result)).toString()
        })
        return numberArray
    } else {
        if (token == '0x000') {
            //主币
            return BigNumber(await Tron.trx.getBalance(ownerTronAddress)).shiftedBy(-6).toString()
        } else {
            const priceParam = [{
                id: 1,
                jsonrpc: "2.0",
                method: "eth_call",
                params: [
                    {
                        data: `0x70a08231000000000000000000000000${hexAddress}`,
                        to: Tron.address.toHex(token),
                    },
                    "latest",
                ],
            },
            {
                id: 2,
                jsonrpc: "2.0",
                method: "eth_call",
                params: [
                    {
                        data: `0x313ce567`,
                        to: Tron.address.toHex(token),
                    },
                    "latest",
                ],
            },
            ]
            const res = await axios.post("https://api.trongrid.io/jsonrpc", priceParam)
            const price = BigNumber(res.data[0].result)
            const decimals = -BigNumber(res.data[1].result)
            return BigNumber(price).shiftedBy(decimals).toString()
        }
    }
}

//判断确认tron地址是否正确
export const checkTronAddress = async (address) => {
    return Tron.isAddress(address)
}

//获取交易gasPrice
export const getTronGasPrice = async () => {
    const gasPrice = await axios.post("https://api.trongrid.io/jsonrpc", { "jsonrpc": "2.0", "id": 1, "method": "eth_gasPrice", "params": [] })
    return BigNumber(gasPrice.data.result).toNumber()
}

//获取交易的gasLimit
export const getTronGasLimit = async (data) => {
    const operateType = useNuxtApp().$managerScheduler.operateType.value
    const globalData = useGlobalData()


    if (data.firstRouteList[0].token == '0x0000000000000000000000000000000000000000') {
        const isMasterCoin = data.firstRouteList[0].token == '0x0000000000000000000000000000000000000000'
        const web3 = new Web3(ethRpc)
        const swapExactTokensForTokensAbi = swapAbi.filter(item => item.name == 'swapExactTokensForTokens')[0]
        const swapTokensForExactTokensAbi = swapAbi.filter(item => item.name == 'swapTokensForExactTokens')[0]
        const codeData = web3.eth.abi.encodeFunctionCall(operateType == 'pay' ? swapExactTokensForTokensAbi : swapTokensForExactTokensAbi, [
            ...getfunctionData(data, operateType)
        ])
        const estimateGas = await web3.eth.estimateGas({
            from: converttoEth(Tron.address.toHex(globalData.ownerTronAddress)),
            to: converttoEth(Tron.address.toHex(data.contractAddress)),
            value: isMasterCoin ? getfunctionData(data, operateType, true)[7] : 0,
            data: codeData
        });
        return estimateGas
    } else {
        const params = {
            owner_address: Tron.address.toHex(globalData.ownerTronAddress),
            contract_address: Tron.address.toHex(data.contractAddress),
            parameter: getenCode(data, operateType)
        };
        if (operateType == 'pay') {
            params.function_selector = "swapExactTokensForTokens(address,address,address,address,address,address,address,uint256,uint256,address,uint256)"
        } else {
            params.function_selector = "swapTokensForExactTokens(address,address,address,address,address,address,address,uint256,uint256,address,uint256)"
        }
        const energy = await axios.post("https://api.trongrid.io/wallet/triggerconstantcontract", params)
        return energy.data.energy_used
    }

}

//获取合约已授权的币种余额
export const getTronAllowance = async (coinToken, contractToken) => {
    const globalData = useGlobalData()
    const tokenContract = Tron.contract(tokenAbi, coinToken)
    const data = await tokenContract.allowance(globalData.ownerTronAddress, contractToken).call()
    return BigNumber(data._hex).toNumber()
}
//获取授权需要的GasLimit
export const getApproveLimit = async (coinToken, contractToken) => {
    const globalData = useGlobalData()
    const web3 = new Web3(ethRpc)
    const contract = new web3.eth.Contract(tokenAbi, converttoEth(coinToken))
    const data = await contract.methods.approve(converttoEth(globalData.ownerTronAddress), converttoEth(contractToken)).estimateGas({ from: converttoEth(globalData.ownerTronAddress) })
    return data
}

//将币种的最大额度授权给交易合约
export const tronApprove = async (coinToken, contractToken) => {
    const tokenContract = Tron.contract(tokenAbi, coinToken)
    const totalSupply = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    await tokenContract.approve(contractToken, totalSupply).call()
}

export const getTronContract = async (contractAddress) => {
    return await Tron.contract().at(contractAddress);
}

//一些工具方法
const getenCode = (data, type) => {
    const web3 = new Web3(ethRpc)
    const parameter = web3.eth.abi.encodeParameters(
        ["address", "address", "address", "address", "address", "address", "address", "uint256", "uint256", "address", "uint256"],
        getfunctionData(data, type)
    )
    return parameter.slice(2)
}
const converttoEth = (address) => {
    return Tron.address.toHex(address).replace('41', '0x')
}
const getfunctionData = (data, type) => {
    const globalData = useGlobalData()
    const slippage = useNuxtApp().$managerScheduler.slippage.value
    const valueArray = []
    data.firstRouteList.map(item => {
        valueArray.push(converttoEth(item.token))
    })
    data.routeList.map(item => {
        valueArray.push(converttoEth(item))
    })
    valueArray.push(data.amountIn)
    valueArray.push(parseInt(((data.amountOut * (100 - Number(slippage))) / 100)).toString())
    valueArray.push(converttoEth(globalData.ownerTronAddress))
    valueArray.push((new Date().getTime() + 3 * 60 * 60).toString())
    if (type == 'receive') {
        valueArray[7] = parseInt(((data.amountIn * (100 + Number(slippage))) / 100)).toString()
        valueArray[8] = data.amountOut
    }
    return valueArray
}
