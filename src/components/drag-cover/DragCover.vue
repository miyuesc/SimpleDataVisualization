<template>
  <div class="drag-indicator-area">
    <span
      v-for="point in points"
      :key="point"
      :class="`indicator-point indicator-point-${point}`"
      :style="pointsStyle"
      @mousedown.stop.prevent="handleToResize(point, $event)"
    ></span>
  </div>
</template>
<script>
export default {
  name: "DragCover",
  setup() {

  }
}
</script>
<style>

</style>
