<template>
  <button @click="event1">test1</button>
  <button @click="event2">test2</button>
  <button @click="event3">test3</button>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "SimpleController",
  setup() {
    const store = useStore();
    const activeElementState = store.state.activeElement;
    const editorScreenState = store.state.editorScreen;

    const activeState = computed(() => {
      return { ...activeElementState }
    });

    return {
      activeState,
      event1:() => {
        store.commit("activeElement/updateVisible", !activeElementState.visible);
        store.commit("activeElement/updateMoving", !activeElementState.moving);
      },
      event2:() => {
        store.commit("activeElement/updatePosition", {
          left: Math.floor(Math.random() * 1000), top: Math.floor(Math.random() * 600)
        });
      },
      event3:() => {
        store.commit("editorScreen/updateScale", Math.floor(Math.random() * 10) / 10);
      }
    }
  }
}
</script>

<style scoped lang="scss">
button + button {
  margin-left: 8px;
}
</style>
