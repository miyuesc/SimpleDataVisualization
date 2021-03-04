<template>
  <div class="drag-guide-line vertical-line" v-show="moving" v-bind:style="verticalStyle"></div>
  <div class="drag-guide-line horizontal-line" v-show="moving" v-bind:style="horizontalStyle"></div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "DragGuideLines",
  setup() {
    const store = useStore();
    const activeElementState = store.state.activeElement;
    const editorScreenState = store.state.editorScreen;

    return {
      moving: computed(() => activeElementState.moving),
      verticalStyle: computed(() => {
        return `top: 0px; left: ${activeElementState.position.left}px; width: ${activeElementState.size.width}px; height: 100%; border-width: ${Math.floor(1 / editorScreenState.scale)}px`
      }),
      horizontalStyle: computed(() => {
        return `top: ${activeElementState.position.top}px; left: 0px; width: 100%; height: ${activeElementState.size.height}px; border-width: ${Math.floor(1 / editorScreenState.scale)}px`
      })
    }
  }
}
</script>

<style>
.drag-guide-line {
  position: absolute;
  background: none;
  box-sizing: border-box;
  outline: none;
  pointer-events: none;
  border-color: #c81414;
  border-style: dashed;
  z-index: 1;
}
.vertical-line {
  border-top: none;
  border-bottom: none;
}
.horizontal-line {
  border-left: none;
  border-right: none;
}
</style>
