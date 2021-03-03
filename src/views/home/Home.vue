<template>
  <div></div>
  <h1>home page</h1>
  <span>This is home page!</span>
  <p>bababababaababaab</p>
  <button @click="updateLineVisible">change visible</button>
  <button @click="updateLinePosition">change position</button>
  <div class="test-box">
    <drag-guide-lines />
  </div>
</template>

<script>
import { useStore } from "vuex";

import DragGuideLines from "@/components/drag-cover/DragGuideLines.vue";

export default {
  name: "Home",
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
.test-box {
  position: relative;
  box-sizing: border-box;
  width: 100vw;
  height: 850px;
  background: rgb(250, 235, 215);
}
</style>
