import { getTronAddress } from "~~/helper/tron";

export default async function () {
  let ownerTronAddress:string
  ownerTronAddress = await getTronAddress()
  return ownerTronAddress
}