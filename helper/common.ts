export const simplifyToken = (token:string) => {
  if(token == '0x000') return ''
  if(token.length>8){
    return token.substring(0, 8) + "......" + token.substring(token.length - 8, token.length)
  } else{
    return token
  }
};

export const getStringNum = (number:number|string, decimals:number = 8) => {
  const numString = number.toString()
  if(numString.includes(".")){
    const stringArray = numString.split('.')
    const lastNumber = stringArray[1].length < decimals ? stringArray[1] : stringArray[1].substring(0,decimals)
    return stringArray[0] + '.' + lastNumber
  } else {
    return numString
  }
}

//科学计数转字符串
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

