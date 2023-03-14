<template>
	<div class="w-120px h-9px relative">
		<div v-if="showType == 'loading'" class="w-120px h-9px absolute top-0 z-12" ref="progressTarget"></div>
		<div v-if="showType == 'dones'" class="w-120px h-9px absolute top-0 z-13" ref="doneTarget"></div>
		<div v-if="showType == 'none'" class="w-120px h-9px absolute top-0 bg-[#f5f6fa] mt-3px z-11"></div>
	</div>
</template>

<script >
import lottie from "lottie-web";
import progress from "~~/public/jsonImg/progress/data.json";
import done from "~~/public/jsonImg/done/data.json";
export default {
	props: {
		showType: {
			type: String,
			default: "",
		},
	},
	mounted() {},
	watch: {
		showType: {
			handler(val) {
				if (val === "loading") {
					this.$nextTick(() => {
						lottie.loadAnimation({
							container: this.$refs.progressTarget,
							renderer: "svg",
							loop: true,
							autoplay: true,
							animationData: progress,
						});
					});
				}
				if (val === "dones") {
					this.$nextTick(() => {
						lottie.loadAnimation({
							container: this.$refs.doneTarget,
							renderer: "svg",
							loop: 0,
							autoplay: true,
							animationData: done,
						});
					});
				}
			},
			immediate: true,
		},
	},
};
</script>