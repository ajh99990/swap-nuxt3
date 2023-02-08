import { ErrorCode, ErrorEntity } from "./shared"

const customError: Partial<Record<ErrorCode, () => ErrorEntity>> = {}
function addRequestError(param: ErrorEntity) {
  customError[param.code] = () => param
}
/** 创建一个异常响应对象 */
export function createRequestError(errorCode: ErrorCode) {
  const errorBuilder = customError[errorCode]
  if (errorBuilder) {
    return errorBuilder()
  } else {
    return {
      code: ErrorCode.Uncaught,
      msg: "网络异常，请检查您的网络状态",
      enMsg: "network error"
    }
  }
}

addRequestError({
  code: ErrorCode.RepeatedRequest,
  msg: "取消请求",
  enMsg: "cancel request"
})