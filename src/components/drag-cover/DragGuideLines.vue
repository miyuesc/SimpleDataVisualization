<template>
  <div class="drag-guide-line vertical-line" v-show="visible" v-bind:style="verticalStyle"></div>
  <div class="drag-guide-line horizontal-line" v-show="visible" v-bind:style="horizontalStyle"></div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "DragGuideLines",
  setup() {
    const store = useStore();

    const dragState = store.state.dragModule

    console.log(dragState);

    return {
      position: computed(() => dragState.position),
      size: computed(() => dragState.size),
      visible: computed(() => dragState.visible),
      moving: computed(() => dragState.moving),
      verticalStyle: computed(() => {
        return `top: 0px; left: ${dragState.position.left}px; width: ${dragState.size.width}px; height: 100%`
      }),
      horizontalStyle: computed(() => {
        return `top: ${dragState.position.top}px; left: 0px; width: 100%; height: ${dragState.size.height}px`
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
  z-index: 1000;
}
.vertical-line {
  border-width: 0 1px 0 1px;
}
.horizontal-line {
  border-width: 1px 0 1px 0;
}
</style>
