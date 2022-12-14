<template>
  <div class="example-axios bg-orange-100 border-orange-300 border-width-1px rounded-4px p-6px">
    <div class="p-4px mt-3px  bg-orange-500 text-white"> 用来演示请求后端接口的方法。 </div>
    <!-- 演示get请求 -->
    <div class="mt-12px ml-8px">
      <div class="p-4px mb-6px bg-orange-400 text-white">演示get请求</div>
      <div>
        <span>选择链：</span>
        <select class="simple-selecter" v-model="selectedChain" name="tokenType">
          <option v-for="item in chainList" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>
      <div>
        <span>查看链上有哪些代币：</span>
        <Loading v-if="loading" class="ml-8px w-14px h-14px" />
        <span v-else>{{ tokensString }}</span>
      </div>
    </div>
    <!-- 演示post请求 -->
    <div class="mt-12px ml-8px">
      <div class="p-4px mb-6px bg-orange-400 text-white">演示post请求</div>
      <span>表单：</span>
      <input type="text" v-model="formData" place="要购买的token名称">
      <button @click="submit">提交</button>
      <br />
      <span>响应：</span>
      <span>{{ resText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import useChainList from "./useChainList"
import useTokenList from "./useTokenList"
import usePostForm from "./usePostForm"
const { chainList, selectedChain } = useChainList()
const { loading, tokensString } = useTokenList({ selectedChain })
const { formData, submit, resText } = usePostForm()
</script>
