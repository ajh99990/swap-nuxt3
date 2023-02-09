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