<template>
  <div class="drag-indicator-area" :style="indicatorAreaStyle" v-show="visible">
    <span v-for="point in points" :key="point" :class="`indicator-point indicator-point-${point}`" :style="pointsScale"></span>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "DragIndicatorPoints",
  setup() {
    const store = useStore();
    const activeElementState = store.state.activeElement
    const editorScreenState = store.state.editorScreen;

    const points = ["tl", "tm", "tr", "lm", "rm", "bl", "bm", "br"]; // 左上角开始顺时针对应的各个指示点

    return {
      points,
      visible: computed(()=> activeElementState.visible),
      indicatorAreaStyle: computed(() => {
        return `width: ${activeElementState.size.width}px; height: ${activeElementState.size.height}px; left: ${activeElementState.position.left}px; top: ${activeElementState.position.top}px`
      }),
      pointsScale: computed(() => {
        return `transform: scale(${1 / editorScreenState.scale})`;
      })
    }
  }
}
</script>

<style scoped lang="scss">
.drag-indicator-area {
  position: absolute;
  background: none;
  box-sizing: border-box;
  outline: none;
  border: 2px solid #4a71fe;
  pointer-events: none;
  z-index: 2;
}
.indicator-point {
  position: absolute;
  display: inline-block;
  width: 6px;
  height: 6px;
  box-sizing: border-box;
  border: 1px solid #4a71fe;
  border-radius: 50%;
  background: #ffffff;
  z-index: 3;
}
.indicator-point-tl {
  top: -4px;
  left: -4px;
}
.indicator-point-tm {
  top: -4px;
  left: 50%;
}
.indicator-point-tr {
  top: -4px;
  right: -4px;
}
.indicator-point-lm {
  top: 50%;
  left: -4px;
}
.indicator-point-rm {
  top: 50%;
  right: -4px;
}
.indicator-point-bl {
  bottom: -4px;
  left: -4px;
}
.indicator-point-bm {
  bottom: -4px;
  left: 50%;
}
.indicator-point-br {
  bottom: -4px;
  right: -4px;
}
</style>
