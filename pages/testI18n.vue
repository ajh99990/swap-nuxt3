<template>
  <div class="test-i18n">
    <div>当前语言：{{ i18n.locale.value }}</div>
    <div>{{ $t("hello") }}</div>
    <br />
    <div>{{ text }}</div>
    <br />
    <button @click="handleSwitchLang('zh')">切换到中文</button>
    <br />
    <button @click="handleSwitchLang('en')">切换到英文</button>
  </div>
</template>

<script setup lang="ts">
const i18n = useI18n();
const text = computed(() => i18n.t("hello"));
const handleSwitchLang = (langName: string) => {
  i18n.locale.value = langName;
};
</script>
