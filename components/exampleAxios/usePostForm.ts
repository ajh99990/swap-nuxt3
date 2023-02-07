import useBaseApi from "@/api/useBaseApi"

export default function () {
  const baseApi = useBaseApi();
  const formData = ref("");
  const resText = ref("");

  const submit = () => {
    baseApi.post(({ api }) => {
      return {
        api: api.buy,
        //onlySend:true,//同时只能存在一个请求
        data: {
          formData: formData.value
        },
        success: (res) => {
          resText.value = res
        }
      }
    })
  }

  return { formData, submit, resText }
}