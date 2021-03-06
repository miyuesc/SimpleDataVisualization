<template>
  <div class="editor-container">
    <header class="editor-header">
      header content
    </header>
    <main class="editor-main">
      <aside class="editor-aside"></aside>
      <aside class="editor-context-pad"></aside>
      <div class="editor-control-bar">
        <simple-controller />
      </div>
      <div class="editor-content">
        <div class="screen">
          <!-- 背景元素区域 -->
          <div class="editor-wrapper-area" :style="screenStyle" @click="handleClickBackground"></div>
          <!-- 元素存在区域 -->
          <div class="editor-canvas-area" :style="screenStyle">
            <drag-guide-lines />
            <components-canvas />
          </div>
          <!-- 指示器区域 -->
<!--          <div class="editor-indicator-area" :style="screenStyle" @click="handleClickBackground">-->
<!--            <drag-resize-indicator />-->
<!--          </div>-->
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

import DragGuideLines from "@/components/drag-cover/DragGuideLines.vue";
import SimpleController from "@/components/editor-control-bar/SimpleController.vue";
import ComponentsCanvas from "./components/ComponentsCanvas.vue";

export default {
  name: "Editor",
  components: { ComponentsCanvas, SimpleController, DragGuideLines },
  setup() {
    const store = useStore();
    const activeElementState = store.state.activeElement;
    const editorScreenState = store.state.editorScreen;

    const screenStyle = computed(() => {
      let { scale } = editorScreenState;
      return `transform: scale(${scale});`
    })

    const handleClickBackground = () => {
      let newElementState = { position: { left: 0, top: 0 }, size: { width: 1920, height: 1080 }, moving: false, visible: false };
      store.commit("activeElement/updateAll", newElementState);
    }

    return {
      ...activeElementState,
      screenStyle,
      handleClickBackground
    }
  }
}
</script>

<style scoped lang="scss">
@import "editor-style.scss";
</style>
