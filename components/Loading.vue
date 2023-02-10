<template>
	<div>
		<div class="w-37px h-37px" ref="animaTarget"></div>
	</div>
</template>

<script>
import lottie from "lottie-web";
import loading from "../public/jsonImg/loadingJson/data.json";
export default {
	mounted() {
		lottie.loadAnimation({
			container: this.$refs.animaTarget,
			renderer: "svg",
			loop: true,
			autoplay: true,
			animationData: loading,
		});
	},
};
</script>

<style>
</style>