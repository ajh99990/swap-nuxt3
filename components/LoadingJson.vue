<template>
	<div>
		<lottie :animationData="jumpCoinImg" :loop="true" class="w-46px"></lottie>
	</div>
</template>

<script>
import lottie from "vue-lottie/src/lottie.vue";
import loadingJson from "";
loadingJson.assets.forEach((item) => {
	item.u = "";
	if (item.w && item.h) {
		item.p = require(`~~/assets/images/jsonImg/loadingJson/images/${item.p}`);
	}
});
export default {
	components: { lottie },
	data() {
		return {
			loadingJson,
		};
	},
};
</script>

<style>
</style>