<template>
  <drag-resize-indicator v-for="cpt in components" :key="cpt.id" :class="`cp cp__${cpt.id}`" :details="cpt">
    <p>{{ cpt.id }}</p>
  </drag-resize-indicator>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";

import DragResizeIndicator from "@/components/drag-cover/DragResizeIndicator.vue";

export default {
  name: "ComponentsCanvas",
  components: { DragResizeIndicator },
  setup() {
    const store = useStore();
    const componentsState = store.state.components;

    const components = computed(() => {
      console.log("components: ", componentsState.components);
      return componentsState.components;
    });

    return {
      components
    }
  }
}
</script>

<style lang="scss">
.cp {
  background: #00b9ff55;
}
</style>
