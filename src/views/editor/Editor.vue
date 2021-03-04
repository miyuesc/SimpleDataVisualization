<template>
  <div class="editor-container">
    <header class="editor-header">
      header content
    </header>
    <main class="editor-main">
      <aside class="editor-aside"></aside>
      <aside class="editor-context-pad"></aside>
      <div class="editor-content">
        <!-- 背景元素区域 -->
        <div class="editor-wrapper-area"></div>
        <!-- 元素存在区域 -->
        <div class="editor-canvas-area"></div>
        <!-- 指示器区域 -->
        <div class="editor-indicator-area">
          <drag-guide-lines />
          <drag-indicator-points />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useStore } from "vuex";

import DragGuideLines from "@/components/drag-cover/DragGuideLines.vue";
import DragIndicatorPoints from "@/components/drag-cover/DragIndicatorPoints.vue";

export default {
  name: "Editor",
  components: {DragIndicatorPoints, DragGuideLines},
  setup() {
    const store = useStore();
    const dragState = store.state.dragModule;

    return {
      ...dragState,
      updateLineVisible: () => {
        console.log("dragState: ", dragState)
        store.commit("activeElement/UPDATE_VISIBLE", !dragState.visible);
      },
      updateLinePosition: () => {
        console.log("dragState: ", dragState)
        store.commit("activeElement/UPDATE_POSITION", { left: Math.floor(Math.random() * 1000), top: Math.floor(Math.random() * 600)});
      }
    }
  }
}
</script>

<style scoped>
@import "./editor-style.css";
</style>
