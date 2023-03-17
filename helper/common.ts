import useBaseApi from "~~/api/useBaseApi";
import { showToast } from "vant";
import someingError from '~~/assets/images/soming_erroe.png'
import useGlobalData from "~~/store/useGlobalData";


//格式化展示的token
export const simplifyToken = (token:string) => {
  if(token == '0x000' || token == '') return ''
  if(token.length>8){
    return token.substring(0, 8) + "......" + token.substring(token.length - 8, token.length)
  } else{
    return token
  }
};

//获取指定精度数据
export const getStringNum = (number:number|string, decimals:number = 8) => {
  const numString = scientificString(number).toString()
  if(numString.includes(".")){
    const stringArray = numString.split('.')
    const lastNumber = stringArray[1].length < decimals ? stringArray[1] : stringArray[1].substring(0,decimals)
    if(Number(stringArray[0] + '.' + lastNumber) == 0) return 0
    return stringArray[0] + '.' + lastNumber
  } else {
    return numString
  }
}

//科学计数转字符串 ---- 爆红了整改下
export const  scientificString = (param:string|number) => {
  let strParam:string = String(param)
  let flag = /e/.test(strParam)
  if (!flag) return param

  // 指数符号 true: 正，false: 负
  let sysbol = true
  if (/e-/.test(strParam)) {
    sysbol = false
  }

  // 指数
  let index = Number(strParam.match(/\d+$/)[0])
  
  // 基数
  let basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, '')

  if (sysbol) {
    return basis.padEnd(index + 1, 0)
  } else {
    return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
  }
}

//获取币种对应的法币
export const getAmountToUsdt = async (chain:string, token:string) => {
  const baseApi = useBaseApi()
  const dollar = await baseApi.post(({ api }) => {
    return {
      api: api.getCoinPrice,
      data: [`${chain}_${token}`],
    };
  });
  return dollar[`${chain}_${token}`]
}

//将时间戳转换为时分秒
export const getShowTime = (timesTamp:number) => {
  const globalData = useGlobalData()
  const second = timesTamp/1000
  if(second < 60){
    const unit = globalData.language == 'zh' ? '秒' : 's'
    return second + unit
  } else if (second >= 36000 && second < 3600 ){
    const min = Math.ceil(second / 60)
    const unit = globalData.language == 'zh' ? '分': min > 1 ? 'mins' :'min'
    return min + unit
  } else {
    const hour = Math.ceil(second / 3600)
    const unit = globalData.language == 'zh' ? '时': hour > 1 ? 'h' :'hs'
    return hour + unit
  } 
}

export const showSomeingError = () => {
  const { t } = useI18n()
  showToast({
    message: t('seemsProblem'),
    icon: someingError,
    className: 'someing-error'
  });
}