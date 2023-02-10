import BigNumber from "bignumber.js";
import Web3 from 'web3';
import swapAbi from '../eth/abi/abi.json'
import tokenAbi from '../eth/abi/erc20Abi.json';
import axios from "axios";

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

//判断确认tron地址是否正确
export const checkTronAddress = async (address) => {
    return Tron.isAddress(address)
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
                        data: `0x70a08231000000000000000000000000${hexAddress}`, //拼接用户地址去掉41开头
                        to: Tron.address.toHex(token), //usdt
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
                        data: `0x313ce567`, //拼接用户地址去掉41开头
                        to: Tron.address.toHex(token), //usdt
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