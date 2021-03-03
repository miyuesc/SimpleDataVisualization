<template>
  <div class="drag-indicator-area" :style="indicatorAreaStyle">
    <span v-for="point in points" :key="point" :class="`indicator-point indicator-point-${point}`"></span>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "DragIndicatorPoints",
  setup() {
    const store = useStore();
    const dragState = store.state.dragModule

    const points = ["tl", "tm", "tr", "lm", "rm", "bl", "bm", "br"]; // 左上角开始顺时针对应的各个指示点

    return {
      points,
      indicatorAreaStyle: computed(() => {
        return `width: ${dragState.size.width}px; height: ${dragState.size.height}px; left: ${dragState.position.left}px; top: ${dragState.position.top}px`
      })
    }
  }
}
</script>

<style scoped>
.drag-indicator-area {
  position: absolute;
  background: none;
  box-sizing: border-box;
  outline: none;
  border: 1px solid #00b9ff;
  pointer-events: none;
  z-index: 1001;
}
.indicator-point {
  position: absolute;
  display: inline-block;
  width: 6px;
  height: 6px;
  box-sizing: border-box;
  border: 1px solid rgb(74, 113, 254);
  border-radius: 50%;
  background: #ffffff;
  z-index: 2;
  transform: translateX(-50%) translateY(-50%);
}
.indicator-point-tl {
  top: 0;
  left: 0;
}
.indicator-point-tm {
  top: 0;
  left: 50%;
}
.indicator-point-tr {
  top: 0;
  left: 100%;
}
.indicator-point-lm {
  top: 50%;
  left: 0;
}
.indicator-point-rm {
  top: 50%;
  left: 100%;
}
.indicator-point-bl {
  top: 100%;
  left: 0;
}
.indicator-point-bm {
  top: 100%;
  left: 50%;
}
.indicator-point-br {
  top: 100%;
  left: 100%;
}
</style>
