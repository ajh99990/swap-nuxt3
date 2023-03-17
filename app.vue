<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import useGlobalData from "./store/useGlobalData";
const globalData = useGlobalData();
const i18n = useI18n();
const query = window.location.search.substring(1);
var vars: string[] = query.split("&");
vars.map((item) => {
  var pair = item.split("=");
  if (pair[0] == "language") {
    i18n.locale.value = pair[1];
    globalData.language = pair[1];
  }
});
</script>