<template>
  <div class="pt-12px px-16px h-100vh">
    patchObject<br />
    1<button @click="handle1">设置对象全部+strtest1</button><br /><br />
    2<button @click="handle2">设置对象全部+strtest2</button><br /><br />
    3<button @click="handle3">设置对象简单+strtest1</button><br /><br />
    4<button @click="handle4">设置对象简单+strtest2</button><br /><br />
    5<button @click="handle5">设置对象简单(ref)+strtest2</button><br /><br />
    6<button @click="handle6">设置对象简单(Active)+strtest2</button
    ><br /><br /><br />
    direct<br />
    7<button @click="handle7">设置对象全部</button><br /><br />
    8<button @click="handle8">设置对象简单</button><br /><br /><br />
    patchFunction<br />
    9<button @click="handle9">设置对象全部+strtest1</button><br /><br />
    0<button @click="handle0">设置对象简单+strtest2</button><br /><br />
  </div>
</template>

<script setup>
import useGlobalData from "~~/store/useGlobalData";
const objall = {
  bsc: { rpc: "https://bsc-dataseed1.defibit.io" },
  eth: { rpc: "https://rpc.ankr.com/eth" },
  polygon: { rpc: "https://polygon-bor.publicnode.com" },
  tron: { rpc: "" },
  arbitrum: { rpc: "https://arb1.arbitrum.io/rpc" },
  optimistic: { rpc: "https://endpoints.omniatech.io/v1/op/mainnet/public" },
  heco: { rpc: "https://http-mainnet.hecochain.com" },
  okex: { rpc: "https://exchainrpc.okex.org" },
};
const objsimple = { bsc: { rpc: "123123" } };
const objallRef = ref(objall);
const objallActive = reactive(objall);
const objsimpleRef = ref(objsimple);
const objsimpleActive = reactive(objsimple);

const strtest1 = "123";
const strtest2 = "testvalue";
const globalData = useGlobalData();
const handle1 = () => {
  globalData.$patch({
    zobjtest: objall,
    zstrtest: strtest1,
  });
};
const handle2 = () => {
  globalData.$patch({
    zobjtest: objall,
    zstrtest: strtest2,
  });
};
const handle3 = () => {
  globalData.$patch({
    zobjtest: objsimple,
    zstrtest: strtest1,
  });
};
const handle4 = () => {
  globalData.$patch({
    zobjtest: objsimple,
    zstrtest: strtest2,
  });
};
const handle5 = () => {
  globalData.$patch({
    zobjtest: objsimpleRef,
    zstrtest: strtest1,
  });
};
const handle6 = () => {
  globalData.$patch({
    zobjtest: objsimpleActive,
    zstrtest: strtest2,
  });
};
const handle7 = () => {
  globalData.zobjtest = objall;
};
const handle8 = () => {
  globalData.zobjtest = objsimple;
};

const handle9 = () => {
  globalData.$patch((state) => {
    state.zobjtest = objall;
    state.zstrtest = strtest1;
  });
};
const handle0 = () => {
  globalData.$patch((state) => {
    state.zobjtest.value = objsimple;
    state.zstrtest = strtest2;
  });
};
</script>
