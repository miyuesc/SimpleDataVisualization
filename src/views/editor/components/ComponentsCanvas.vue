<template>
  <div class="editor-canvas-area" :style="cpStyle" @mousedown="clearHandlerVisible">
    <div
      v-for="cpt in components"
      :key="cpt.id"
      :class="`cp cp__${cpt.id}`"
      :style="{
        width: `${ cpt.size.width }px`,
        height: `${ cpt.size.height }px`,
        left: `${ cpt.position.left }px`,
        top: `${ cpt.position.top }px`,
        zIndex: cpt.zIndex
      }"
      @mousedown.stop.prevent="changeActiveElement(cpt, $event)"
    >
      <p>{{ cpt.id }}</p>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { debounce, throttle } from "../../../utils/common-utils";

export default {
  name: "ComponentsCanvas",
  props: { cpStyle: String },
  setup() {
    const store = useStore();
    const componentsState = store.state.components;
    const activeElementState = store.state.activeElement;
    // const editorScreenState = store.state.editorScreen;

    const components = computed(() => componentsState.components);

    const updateActiveElementState = newState => store.commit("activeElement/updateAll", newState);

    const changeActiveElement = (cpt, event) => {
      let mdc = {
        x: event.target.offsetLeft, // 鼠标所在元素 距离父元素左侧 的距离
        y: event.target.offsetTop, // 鼠标所在元素 距离父元素上侧 的距离
        mouseX: event.clientX, // 鼠标处于屏幕的横向位置
        mouseY: event.clientY // 鼠标处于屏幕的纵向位置
      };
      store.commit("editorScreen/updateMDC", mdc)
      updateActiveElementState({ ...cpt, visible: true, movable: true });
    }

    const clearHandlerVisible = () => {
      store.commit("activeElement/updateMovable", false);
      store.commit("activeElement/updateVisible", false);
      store.commit("activeElement/updateResizable", false);
    }

    return {
      components,
      changeActiveElement,
      clearHandlerVisible
    }
  }
}
</script>

<style lang="scss">
.cp {
  background: #00b9ff99;
  position: absolute;
}
</style>
