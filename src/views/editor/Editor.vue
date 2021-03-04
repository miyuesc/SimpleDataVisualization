<template>
  <div class="editor-container">
    <header class="editor-header">
      header content
    </header>
    <main class="editor-main">
<!--      <aside class="editor-aside"></aside>-->
<!--      <aside class="editor-context-pad"></aside>-->
      <div class="editor-control-bar">
        <simple-controller />
      </div>
      <div class="editor-content">
        <div class="screen">
          <!-- 背景元素区域 -->
          <div class="editor-wrapper-area" :style="screenStyle"></div>
          <!-- 元素存在区域 -->
          <div class="editor-canvas-area" :style="screenStyle"></div>
          <!-- 指示器区域 -->
          <div class="editor-indicator-area" :style="screenStyle">
            <drag-guide-lines />
            <drag-indicator-points />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

import DragGuideLines from "@/components/drag-cover/DragGuideLines.vue";
import DragIndicatorPoints from "@/components/drag-cover/DragIndicatorPoints.vue";
import SimpleController from "@/components/editor-control-bar/SimpleController.vue";

export default {
  name: "Editor",
  components: { SimpleController, DragIndicatorPoints, DragGuideLines },
  setup() {
    const store = useStore();
    const activeElementState = store.state.activeElement;
    const editorScreenState = store.state.editorScreen;

    return {
      ...activeElementState,
      screenStyle: computed(() => {
        let { scale, position: { top , left } } = editorScreenState;
        return `transform: scale(${scale})`
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "editor-style.scss";
</style>
