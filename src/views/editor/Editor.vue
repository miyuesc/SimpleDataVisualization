<template>
  <div class="editor-container">
    <div class="editor-header"></div>
    <div class="editor-slider"></div>
    <div class="editor-context-pad"></div>
    <div class="editor-content">
      <!-- 背景元素区域 -->
      <div class="editor-wrapper-area"></div>
      <!-- 元素存在区域 -->
      <div class="editor-canvas-area"></div>
      <!-- 指示器区域 -->
      <div class="editor-indicator-area">
        <drag-guide-lines />
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";

import DragGuideLines from "@/components/drag-cover/DragGuideLines.vue";

export default {
  name: "Editor",
  components: {DragGuideLines},
  setup() {
    const store = useStore();
    const dragState = store.state.dragModule;

    return {
      ...dragState,
      updateLineVisible: () => {
        console.log("dragState: ", dragState)
        store.commit("dragModule/UPDATE_VISIBLE", !dragState.visible);
      },
      updateLinePosition: () => {
        console.log("dragState: ", dragState)
        store.commit("dragModule/UPDATE_POSITION", { left: Math.floor(Math.random() * 1000), top: Math.floor(Math.random() * 600)});
      }
    }
  }
}
</script>

<style scoped>
.editor-container {
  position: relative;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  background: rgb(250, 235, 215);
}
</style>
