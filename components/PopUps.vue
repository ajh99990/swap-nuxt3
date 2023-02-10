<template>
	<van-popup v-model:show="showProps" @close="closwPropup" lazy-render position="bottom" round :style="{ height: propHeight }" :close-icon="iconClose" close-icon-position="top-right" class="close_icon" :transition-appear="true" closeable>
		<p class="w-375px bg-[#F5F6FA] py-15px px-20px text-size-18px font-500">{{ popupTitle }}</p>
		<slot v-if="showProps"></slot>
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