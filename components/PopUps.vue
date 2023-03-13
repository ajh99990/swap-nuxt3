<template>
	<van-popup v-model:show="showProps" @close="closwPropup" @open="openContent" @closed="closeContent" lazy-render position="bottom" round :close-icon="iconClose" close-icon-position="top-right" class="close_icon" :transition-appear="true" closeable>
		<p class="w-375px bg-[#F5F6FA] py-15px px-20px text-size-18px font-500">{{ popupTitle }}</p>
		<div class="overflow-hidden">
			<slot v-if="showContent"></slot>
		</div>
	</van-popup>
</template>

<script setup>
import iconClose from "@/assets/images/icon_close.png";
const props = defineProps({
	propHeight: String,
	showState: Boolean,
	popupTitle: String,
});

const showProps = computed(() => {
	return props.showState ? props.showState : false;
});

const emit = defineEmits(["closePropUp"]);

const closwPropup = () => {
	emit("closePropUp");
	closeContent();
};

const showContent = ref(false);
let timer = ref(null);
const openContent = () => {
	clearTimeout(timer);
	showContent.value = true;
};
const closeContent = () => {
	timer = setTimeout(() => {
		showContent.value = false;
	}, 150);
};
</script>

<style lang="scss" scoped>
close_icon {
	.van-icon,
	img {
		--van-popup-close-icon-margin: 12px;
	}
}
</style>