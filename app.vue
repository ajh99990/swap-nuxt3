<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
//http://localhost:3000/testI18n?language=en
const i18n = useI18n();
const route = useRoute();
const lang = (route.query.language as string) || "zh";
i18n.locale.value = lang;
</script>
