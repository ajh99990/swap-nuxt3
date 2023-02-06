<template>
	<van-image round :style="{ width: props.logoWidth, height: props.logoWidth }" v-if="props.logo" :src="props.logo">
		<template v-slot:loading>
			<p
				:class="
          (specialStyle
            ? 'bg-[#F7F9FE] border-[#E6E8EC]'
            : 'bg-[#eaf0fa] border-[#BDC0C8]',
          smallCoin ? 'pt-1px text-9px' : 'pt-2px text-11px')
        "
				class="rounded-full inline-block border-solid border-1px rounded-full text-[#b7c5da] font-500 text-11px flex justify-center items-center"
				:style="{ width: props.logoWidth, height: props.logoWidth }"
			>
				{{
				smallCoin
				? props?.logoName.substring(0, 1)
				: props?.logoName.substring(0, 3)
				}}
			</p>
		</template>
		<template v-slot:error>
			<p
				:class="
          (specialStyle
            ? 'bg-[#F7F9FE] border-[#E6E8EC]'
            : 'bg-[#eaf0fa] border-[#BDC0C8]',
          smallCoin ? 'pt-1px text-9px' : 'pt-2px text-11px')
        "
				class="rounded-full inline-block border-solid border-1px rounded-full text-[#b7c5da] font-500 text-11px flex justify-center items-center"
				:style="{ width: props.logoWidth, height: props.logoWidth }"
			>
				{{
				smallCoin
				? props?.logoName.substring(0, 1)
				: props?.logoName.substring(0, 3)
				}}
			</p>
		</template>
	</van-image>
	<div v-else :style="{ width: props.logoWidth, height: props.logoWidth }">
		<p
			:class="
        (specialStyle
          ? 'bg-[#F7F9FE] border-[#E6E8EC]'
          : 'bg-[#eaf0fa] border-[#BDC0C8]',
        smallCoin ? 'pt-1px text-9px' : 'pt-2px text-11px')
      "
			class="rounded-full inline-block border-solid border-1px rounded-full text-[#b7c5da] font-500 flex justify-center items-center"
			:style="{ width: props.logoWidth, height: props.logoWidth }"
		>
			{{
			smallCoin
			? props?.logoName.substring(0, 1)
			: props?.logoName.substring(0, 3)
			}}
		</p>
	</div>
	<!-- </div> -->
</template>

<script setup>
const props = defineProps({
	logo: String,
	logoWidth: String,
	logoName: String,
	smallCoin: Boolean,
	bigCoin: Boolean,
	specialStyle: Boolean,
});
</script>

<style lang="scss" scoped>
</style>