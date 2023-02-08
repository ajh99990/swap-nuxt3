export const simplifyToken = (token:string) => {
  if(token.length>8){
    return token.substring(0, 8) + "......" + token.substring(token.length - 8, token.length)
  } else{
    return token
  }
};