<template>
	<img @click="handleClick" src="@/assets/images/windowSwitch.png" style="transition: all 0.4s;" :style="styleRotate" />
</template>

<script setup>
const emit = defineEmits(["click"]);
const targetAngle = ref(0);
const styleRotate = computed(
	() => `transform: rotate(${targetAngle.value}deg);`
);

const calcuTargetAngle = () => {
	let angle = targetAngle.value + 180;
	targetAngle.value = angle;
};

const handleClick = () => {
	calcuTargetAngle();
	emit("click");
};
</script>

<style lang="scss" scoped>
</style>