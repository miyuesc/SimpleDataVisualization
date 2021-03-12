<template>
  <div class="editor-handler-area" :style="cpStyle" @click="handleClickBackground">
    <drag-indicator-points />
    <drag-guide-lines />
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

import DragGuideLines from "@/components/drag-cover/DragGuideLines.vue";
import DragIndicatorPoints from "@/components/drag-cover/DragResizeIndicator.vue";

export default {
  name: "HandlersCanvas",
  props: { cpStyle: String },
  components: { DragGuideLines, DragIndicatorPoints },
  setup() {

  }
}
</script>
