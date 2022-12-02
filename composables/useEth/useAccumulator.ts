import { Calculator } from "~~/components/calculator/interface";

export default function (): Calculator {
  const data = ref(0)
  const result = computed(() => `将进行加法运算，当前值是:${data.value}`)
  const calculation = (num1: number | string) => {
    if (typeof num1 === "string") {
      num1 = Number.parseFloat(num1)
    }
    data.value += num1
  }
  return {
    calculation,
    result
  }
}