import EthEntry from "./EthEntry.vue"
import type { Ref} from "vue"
import type { ProcessManager, TransferStation,Transferable } from "@/plugins/processManager/scheduler"
import { ProcessNames } from "~~/helper/enum"
import useAccumulator from "./useAccumulator"

export interface ProcessManagerEth extends ProcessManager,Transferable{
  ethCustomValue:Ref,
}

export default function (): ProcessManagerEth {
  const name: ProcessNames = ProcessNames.Eth
  const calculatorProvider = useAccumulator()

  const payTokenType = ref('tokenType1');
  const payTokenCount = ref(0);
  const receiveTokenType = ref("tokenType2");
  const receiveTokenCount = ref(0);
  const ethCustomValue = ref('这是eth交易流程特有的数据');

  const transferTo = (): TransferStation => {
    return {
      payTokenType,
      payTokenCount,
      receiveTokenType,
      receiveTokenCount
    }
  }

  const transferFrom = (transferStation: TransferStation) => {
    console.log('eth接收',transferStation.payTokenType.value,transferStation.payTokenCount.value)
    payTokenType.value = transferStation.payTokenType.value
    payTokenCount.value = transferStation.payTokenCount.value
    receiveTokenType.value = transferStation.receiveTokenType.value
    receiveTokenCount.value = transferStation.receiveTokenCount.value
  }

  return {
    name,
    entry: EthEntry,
    calculatorProvider,

    payTokenType,
    payTokenCount,
    receiveTokenType,
    receiveTokenCount,
    ethCustomValue,

    transferTo,
    transferFrom
  }
}