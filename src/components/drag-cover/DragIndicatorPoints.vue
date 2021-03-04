<template>
  <div class="drag-indicator-area" :style="indicatorAreaStyle" v-show="visible" @mousedown="handleToMove($event)">
    <span
      v-for="point in points"
      :key="point"
      :class="`indicator-point indicator-point-${point}`"
      :style="pointsScale"
      :ref="`point-${point}-ref`"
      @mousedown="handleToResize(point, $event)"
    ></span>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";

export default {
  name: "DragIndicatorPoints",
  setup() {
    const store = useStore();
    const activeElementState = store.state.activeElement
    const editorScreenState = store.state.editorScreen;

    const points = ["tl", "tm", "tr", "lm", "rm", "bl", "bm", "br"]; // 左上角开始顺时针对应的各个指示点

    /* 变量 */
    const isResizing = ref(false);
    const isMoving = ref(false);

    /* 计算属性 */
    const visible = computed(()=> activeElementState.visible);
    const scale = computed(() => editorScreenState.scale);
    const size = computed(() => activeElementState.size);
    const position = computed(() => activeElementState.position);
    const indicatorAreaStyle = computed(() => {
      let { size: { width, height }, position: { left, top } } = activeElementState;
      return `width: ${ width }px; height: ${ height }px; left: ${ left }px; top: ${ top }px`
    })
    const pointsScale = computed(() => {
      return `transform: scale(${ 1 / editorScreenState.scale })`;
    })

    /* 方法 */
    const updateElementPosition = position => store.commit("activeElement/updatePosition", position);
    const updateElementSize = size => store.commit("activeElement/updateSize", size);

    return {
      points,
      isResizing,
      isMoving,
      visible,
      scale,
      size,
      position,
      pointsScale,
      indicatorAreaStyle,
      updateElementPosition,
      updateElementSize
    }
  },
  methods: {
    onMouseMoving(event) {
      // 非 moving 或者 resizing 状态 直接返回
      if (!this.isResizing && !this.isMoving) return ;
      // 拖拽移动部分
      // 根据鼠标移动距离更新元素的当前位置
      let { x, y, mouseX, mouseY } = this._currentPosition;
      let left = x + (event.clientX - mouseX) / this.scale;
      let top = y + (event.clientY - mouseY) / this.scale;
      // 判断是否还在可视区域内, 不在则重设为合法数值
      if (left < 0) left = 0;
      if (left + this.size.width > this._parentNodeSize.width) left = this._parentNodeSize.width - this.size.width;
      if (top < 0) top = 0;
      if (top + this.size.height > this._parentNodeSize.height) top = this._parentNodeSize.height - this.size.height;
      // let isLegalX = (left + this.size.width <= this._parentNodeSize.width) || this.position.left < 0;
      // let isLegalY = (top + this.size.height <= this._parentNodeSize.height) || this.position.top < 0;
      // console.log(isLegalY, isLegalX);
      this.updateElementPosition({ top, left });
    },
    onMouseUp(event) {
      if (!this.isResizing && !this.isMoving) return;
      this.isResizing = false;
      this.isMoving = false;
      console.log(event);
    },
    resizeStart(event) {
      if (!this.isResizing) return ;
      event.stopPropagation && event.stopPropagation();
    },
    handleToResize(point, event) {
      this.isResizing = true;
      console.log(event);
      const currentSize = { width: event.target.parentNode.offsetWidth, height: event.target.parentNode.offsetHeight };
      event.stopPropagation();
      if (point === "tm" || point === "bm") {
        // 垂直方向 resize
        return;
      }
      if (point === "ml" || point === "rm") {
        // 水平方向 resize
        return;
      }
      if (point === "tl" || point === "br") {
        // \ 斜向 resize
        return;
      }
      // / 斜向 resize
    },
    handleToMove(event) {
      // event.stopPropagation();
      this.isMoving = true;
      this._currentPosition = {
        x: event.target.offsetLeft,
        y: event.target.offsetTop,
        mouseX: event.clientX,
        mouseY: event.clientY
        // mouseX: Math.floor(event.offsetX * this.scale),
        // mouseY: Math.floor(event.offsetY * this.scale)
      }
      console.log(this._currentPosition);
    }
  },
  mounted() {
    this._parentNodeSize = this.$el.parentNode ? ({
      width: this.$el.parentNode.clientWidth,
      height: this.$el.parentNode.clientHeight
    }) : null;
    console.log(this.$el.parentNode);
    console.log(this._parentNodeSize);
    this.$el.parentNode && this.$el.parentNode.addEventListener("mousemove", this.onMouseMoving);
    this.$el.parentNode && this.$el.parentNode.addEventListener("touchmove", this.onMouseMoving, true);

    this.$el.parentNode && this.$el.parentNode.addEventListener("mouseup", this.onMouseUp);
    this.$el.parentNode && this.$el.parentNode.addEventListener("touchend touchcancel", this.onMouseUp, true);
  },
  beforeUnmount() {
    this.$el.parentNode && this.$el.parentNode.removeEventListener("mousemove", this.resizeStart);
    this.$el.parentNode && this.$el.parentNode.removeEventListener("touchmove", this.resizeStart, true);

    this.$el.parentNode && this.$el.parentNode.removeEventListener("mouseup", this.onMouseUp);
    this.$el.parentNode && this.$el.parentNode.removeEventListener("touchend touchcancel", this.onMouseUp, true);
  }
}
</script>

<style scoped lang="scss">
.drag-indicator-area {
  position: absolute;
  background: none;
  //box-sizing: border-box;
  outline: none;
  border: 2px solid #4a71fe;
  z-index: 2;
  user-select: none;
}
.indicator-point {
  position: absolute;
  display: inline-block;
  width: 6px;
  height: 6px;
  box-sizing: border-box;
  border: 1px solid #4a71fe;
  border-radius: 50%;
  background: #ffffff;
  z-index: 3;
  user-select: none;
}
.indicator-point-tl {
  top: -4px;
  left: -4px;
  &:hover {
    cursor: se-resize;
  }
}
.indicator-point-tm {
  top: -4px;
  left: 50%;
  &:hover {
    cursor: n-resize;
  }
}
.indicator-point-tr {
  top: -4px;
  right: -4px;
  &:hover {
    cursor: sw-resize;
  }
}
.indicator-point-lm {
  top: 50%;
  left: -4px;
  &:hover {
    cursor: w-resize;
  }
}
.indicator-point-rm {
  top: 50%;
  right: -4px;
  &:hover {
    cursor: w-resize;
  }
}
.indicator-point-bl {
  bottom: -4px;
  left: -4px;
  &:hover {
    cursor: sw-resize;
  }
}
.indicator-point-bm {
  bottom: -4px;
  left: 50%;
  &:hover {
    cursor: n-resize;
  }
}
.indicator-point-br {
  bottom: -4px;
  right: -4px;
  &:hover {
    cursor: se-resize;
  }
}
</style>
