<style scoped>
.el-loading-parent--relative {
  position: relative !important;
}
.el-loading-parent--hidden {
  overflow: hidden !important;
}
.el-loading-mask {
  position: absolute;
  z-index: 2000;
  background-color: rgba(255, 255, 255, 0.85);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}
.el-loading-mask.is-fullscreen {
  position: fixed;
}
.el-loading-mask.is-fullscreen .el-loading-spinner {
  margin-top: -25px;
}

.el-loading-spinner {
  top: 50%;
  margin-top: -21px;
  width: 100%;
  text-align: center;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-loading-spinner .el-loading-text {
  color: #409eff;
  margin: 3px 0;
  font-size: 14px;
}
.el-loading-spinner .circular {
  -webkit-animation: loading-rotate 1.5s linear infinite;
  animation: loading-rotate 1.5s linear infinite;
}
.el-loading-spinner .path {
  -webkit-animation: loading-dash 1.5s ease-in-out infinite;
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: #409eff;
  stroke-linecap: round;
}
.el-loading-spinner i {
  color: #409eff;
}
.el-loading-fade-enter,
.el-loading-fade-leave-active {
  opacity: 0;
}
@-webkit-keyframes loading-rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes loading-rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
</style>
<template>
  <div
    v-show="visible"
    class="el-loading-mask"
    :style="{ backgroundColor: background || '' }"
    :class="[customClass, { 'is-fullscreen': fullscreen }]"
  >
    <div class="el-loading-spinner">
      <Icon class="w-25px h-25px circular" name="loading-anime"/>
      <p v-if="text" class="el-loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: null,
      spinner: null,
      background: null,
      fullscreen: true,
      visible: false,
      customClass: "",
    };
  },

  methods: {
    handleAfterLeave() {
      this.$emit("after-leave");
    },
    setText(text) {
      this.text = text;
    },
  },
};
</script>
