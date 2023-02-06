<template>
	<div class="example-persistent-state bg-green-100 border-green-300 border-width-1px rounded-4px p-6px">
		<div class="p-4px mt-3px bg-green-700 text-white">本组件用于测试本地存储</div>
		<div>当前值是：test1={{ globalData.test1 }} , test2={{ globalData.test2 }}</div>
		<!-- 通过双向绑定修改值 -->
		<div class="mt-8px ml-8px">
			<div class="p-4px mb-6px bg-green-500 text-white">通过双向绑定修改值</div>
			<div>
				test1:
				<input type="text" v-model="globalData.test1" />
			</div>
			<div>
				test2:
				<input type="text" v-model="globalData.test2" />
			</div>
		</div>
		<!-- 通过patch修改值 -->
		<div class="mt-12px ml-8px">
			<div class="p-4px mb-6px bg-green-500 text-white">通过patch修改值</div>
			<button @click="testPatch">点击按钮后将同时修改test1和test2</button>
		</div>
		<!-- 调用$reset()方法将state重置为初始值 -->
		<div class="mt-12px ml-8px">
			<div class="p-4px mb-6px bg-green-500 text-white">调用$reset()方法将state重置为初始值</div>
			<button @click="testReset">重置为初始值</button>(注意此时没有填充缓存值而是填充了默认值)
		</div>
		<!-- 清空缓存 -->
		<div class="mt-12px ml-8px">
			<div class="p-4px mb-6px bg-green-500 text-white">清空缓存</div>
			<button @click="testClearCache">清空缓存</button>
		</div>
		<!-- 清除某个state的缓存 -->
		<div class="mt-12px ml-8px">
			<div class="p-4px mb-6px bg-green-500 text-white">清除某个state的缓存</div>
			<span>选择state:</span>
			<select v-model="clearTarget" name="tokenType">
				<option v-for="name in stateNames" :key="name" :value="name">{{ name }}</option>
			</select>
			<button class="ml-16px" @click="testClearCacheByName">确定</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import useGlobalData from "@/store/useGlobalData";

const globalData = useGlobalData();
const clearTarget = ref(globalData.stateNames.test1);
const stateNames = computed(() => globalData.persistentStateNames);
const testPatch = () => {
	globalData.$patch({
		test1: "test1$patch",
		test2: "test2$patch",
	});
};
const testReset = () => {
	globalData.$reset();
};

const testClearCache = () => {
	globalData.clearCache();
};

const testClearCacheByName = () => {
	globalData.clearCacheByName(clearTarget.value);
};
</script>
