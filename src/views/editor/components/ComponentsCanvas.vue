<template>
  <div v-for="cp in components" :key="cp.id" :class="`cp cp__${cp.id}`" :style="cpStyleCompute(cp)" @click="handleClickElement(cp)"></div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";

export default {
  name: "ComponentsCanvas",
  setup() {
    const store = useStore();
    const activeElementState = store.state.activeElement
    const editorScreenState = store.state.editorScreen;
    const componentsState = store.state.components;

    const components = computed(() => componentsState.components);
    const cpStyleCompute = computed(() => {
      return (cp) => {
        let { size: { width, height }, position: { left, top } } = cp;
        return `width: ${ width }px; height: ${ height }px; left: ${ left }px; top: ${ top }px`;
      }
    })

    const handleClickElement = ({ size, position }) => {
      console.log(activeElementState.state);
      let newElementState = {
        position: { ...position },
        size: { ...size },
        moving: false,
        visible: true
      };
      store.commit("activeElement/updateAll", newElementState);
    }

    return {
      components,
      cpStyleCompute,
      handleClickElement
    }
  }
}
</script>

<style lang="scss">
.cp {
  display: inline-block;
  box-sizing: border-box;
  position: absolute;
  background: #00b9ff55;
}
</style>
