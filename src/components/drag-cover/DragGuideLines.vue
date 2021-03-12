<template>
  <div class="drag-guide-line vertical-line l-vertical-line" v-show="moving" v-bind:style="verticalStyleL"></div>
  <div class="drag-guide-line vertical-line r-vertical-line" v-show="moving" v-bind:style="verticalStyleR"></div>
  <div class="drag-guide-line horizontal-line t-horizontal-line" v-show="moving" v-bind:style="horizontalStyleT"></div>
  <div class="drag-guide-line horizontal-line b-horizontal-line" v-show="moving" v-bind:style="horizontalStyleB"></div>
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
      verticalStyleL: computed(() => {
        let borderWidth = Math.floor(2 / editorScreenState.scale) || 1;
        return `left: ${activeElementState.position.left}px; border-width: 0; border-right-width: ${ borderWidth }px`
      }),
      verticalStyleR: computed(() => {
        let borderWidth = Math.floor(2 / editorScreenState.scale) || 1;
        return `left: ${activeElementState.position.left + activeElementState.size.width - borderWidth }px; border-width: 0; border-right-width: ${ borderWidth }px`
      }),
      horizontalStyleT: computed(() => {
        let borderWidth = Math.floor(2 / editorScreenState.scale) || 1;
        return `top: ${activeElementState.position.top}px; border-width: 0; border-bottom-width: ${ borderWidth }px`
      }),
      horizontalStyleB: computed(() => {
        let borderWidth = Math.floor(2 / editorScreenState.scale) || 1;
        return `top: ${activeElementState.position.top + activeElementState.size.height - borderWidth}px; border-width: 0; border-bottom-width: ${ borderWidth }px`
      })
    }
  }
}
</script>

<style>
.drag-guide-line {
  position: absolute;
  background: none;
  outline: none;
  box-sizing: border-box;
  pointer-events: none;
  border-style: dashed;
  border-color: #c8141499;
  z-index: 1;
}
.vertical-line {
  top: 0;
  bottom: 0;
  width: 0;
}
.horizontal-line {
  left: 0;
  right: 0;
  height: 0;
}
</style>
