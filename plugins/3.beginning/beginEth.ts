import { getOwnerAddress } from "~~/helper/eth/index"

export default async function (presentChain:string){
    let ownerAddress: any
    if(presentChain == 'tron'){
      ownerAddress = await getOwnerAddress('bsc')
    } else {
      ownerAddress = await getOwnerAddress(presentChain)
    }
  return ownerAddress
}