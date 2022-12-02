import TronEntry from "~/components/TronEntry.vue"
import type { ProcessManagerTron, TransferStation } from "~~/@types"
import { processNames } from "~~/helper/enum"
import useAccumulator from "./useAccumulator"

export default function (): ProcessManagerTron {
  const name = processNames.Tron
  const calculatorProvider = useAccumulator()

  const payTokenType = ref('tokenType1');
  const payTokenCount = ref(0);
  const receiveTokenType = ref("tokenType2");
  const receiveTokenCount = ref(0);

  const transferTo = (): TransferStation => {
    return {
      payTokenType,
      payTokenCount,
      receiveTokenType,
      receiveTokenCount
    }
  }
  const transferFrom = (transferStation: TransferStation) => {
    console.log('tron接收',transferStation.payTokenType.value,transferStation.payTokenCount.value)
    payTokenType.value = transferStation.payTokenType.value
    payTokenCount.value = transferStation.payTokenCount.value
    receiveTokenType.value = transferStation.receiveTokenType.value
    receiveTokenCount.value = transferStation.receiveTokenCount.value
  }

  return {
    name,
    entry: TronEntry,
    calculatorProvider,

    payTokenType,
    payTokenCount,
    receiveTokenType,
    receiveTokenCount,

    transferTo,
    transferFrom
  }
}