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
          <div class="editor-wrapper-area" :style="screenStyle"></div>
          <!-- 元素存在区域 -->
          <components-canvas :cp-style="screenStyle" />
          <!-- 指示器区域 -->
          <handlers-canvas :cp-style="screenStyle" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

import SimpleController from "../../components/editor-control-bar/SimpleController.vue";
import ComponentsCanvas from "./components/ComponentsCanvas.vue";
import HandlersCanvas from "./components/HanldersCanvas.vue";

export default {
  name: "Editor",
  components: { HandlersCanvas, ComponentsCanvas, SimpleController },
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
