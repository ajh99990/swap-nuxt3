import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import erc20Abi from './abi/erc20Abi.json';
import { chainInfo } from '~~/helper/chainInfo';

export const getTokenBalanceByBatch = (chain, tokens, currentAddress) => {
    if (tokens.length == 0) return []
    const web3 = new Web3(chainInfo[chain].rpc)
    let tokenLength = tokens.length
    let priceLength = 0, priceObj = {}
    return new Promise((resolve, reject) => {
        const checkResult = (token => {
            if (priceObj[token].balance !== undefined && priceObj[token].decimals) {
                priceLength += 1
                if (priceLength === tokenLength) {
                    resolve(tokens.map(token => BigNumber(priceObj[token].balance).shiftedBy(-priceObj[token].decimals).toString()))
                }
            }
        })
        const batch = new web3.BatchRequest();
        tokens.map((token, index) => {
            const toeknContract = new web3.eth.Contract(erc20Abi, token);
            batch.add(toeknContract.methods.balanceOf(currentAddress).call.request({ from: currentAddress }, (error, result) => {
                priceObj[token] ? priceObj[token].balance = result : (priceObj[token] = {}, priceObj[token].balance = result)
                checkResult(token)
            }))
            batch.add(toeknContract.methods.decimals().call.request({ from: currentAddress }, (error, result) => {
                priceObj[token] ? priceObj[token].decimals = result : (priceObj[token] = {}, priceObj[token].decimals = result)
                checkResult(token)
            }))
        })
        batch.execute()
    })
}