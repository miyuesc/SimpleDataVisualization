<template>
  <div class="drag-indicator-area" :style="indicatorAreaStyle" v-show="visible" @mousedown="handleToMove($event)">
    <span
      v-for="point in points"
      :key="point"
      :class="`indicator-point indicator-point-${point}`"
      :style="pointsScale"
      :ref="`point-${point}-ref`"
      @mousedown.stop.prevent="handleToResize(point, $event)"
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

    /*
     * [ tl --- tm --- tr ]
     * [  |             | ]
     * [ lm            rm ]
     * [  |             | ]
     * [ bl --- bm --- br ]
     */
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
    const updateElementPAS = pas => store.commit("activeElement/updatePAS", pas);

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
      updateElementPAS
    }
  },
  methods: {
    // 鼠标按下，触发 resize 事件
    handleToResize(point, event) {
      event.stopPropagation();
      this.isResizing = true;
      this._activePoint = point;
      this._currentSize = {
        width: event.target.parentNode.clientWidth, // 鼠标所在元素 的标记元素 的宽度
        height: event.target.parentNode.clientHeight, // 鼠标所在元素 的标记元素 的高度
        mouseX: event.clientX, // 鼠标处于屏幕的横向位置
        mouseY: event.clientY // 鼠标处于屏幕的纵向位置
      }
    },
    // 鼠标按下，触发 move 事件
    handleToMove(event) {
      this.isMoving = true;
      this._currentPosition = {
        x: event.target.offsetLeft, // 鼠标所在元素 距离父元素左侧 的距离
        y: event.target.offsetTop, // 鼠标所在元素 距离父元素上侧 的距离
        mouseX: event.clientX, // 鼠标处于屏幕的横向位置
        mouseY: event.clientY // 鼠标处于屏幕的纵向位置
      }
    },
    // 鼠标移动状态
    onMouseMoving(event) {
      // 非 moving 或者 resizing 状态 直接返回
      if (!this.isResizing && !this.isMoving) return;
      // 拖拽移动部分
      if (this.isMoving) {
        this.computedElementPosition(event);
        return;
      }
      // resize 部分
      this.computedElementSize(event);
    },
    // 鼠标抬起，移除事件与状态
    onMouseUp() {
      if (!this.isResizing && !this.isMoving) return;
      this._activePoint = null;
      this.isResizing = false;
      this.isMoving = false;
    },
    // 计算移动距离，更新元素位置
    computedElementPosition(event) {
      // 根据鼠标移动距离更新元素的当前位置
      let { x, y, mouseX, mouseY } = this._currentPosition;
      let left = x + (event.clientX - mouseX) / this.scale;
      let top = y + (event.clientY - mouseY) / this.scale;
      // 判断是否还在可视区域内, 不在则重设为合法数值
      if (left < 0) left = 0;
      if (left + this.size.width > this._parentNodeSize.width) left = this._parentNodeSize.width - this.size.width;
      if (top < 0) top = 0;
      if (top + this.size.height > this._parentNodeSize.height) top = this._parentNodeSize.height - this.size.height;
      this.updateElementPosition({ top, left });
    },
    // 计算移动距离，更新元素大小及位置
    computedElementSize(event) {
      let { width, height, mouseX, mouseY } = this._currentSize;
      let { left, top } = this.position;
      let newWidth = width;
      let newHeight = height;
      let newLeft = left;
      let newTop = top;
      // 根据 鼠标移动距离 设置 新的高宽
      if (this._activePoint === "tl") {
        let newWidth
      }

      // let newWidth = width + (event.clientX - mouseX) / this.scale;
      // let newHeight = height + (event.clientY - mouseY) / this.scale;
      // let newLeft = left;
      // let newTop = top;
      // if (this._activePoint.indexOf("t") !== -1) {
      //   newTop = top + (event.clientY - mouseY) / this.scale;
      // }
      // if (this._activePoint.indexOf("l") !== -1) {
      //   newLeft = left + (event.clientX - mouseX) / this.scale;
      // }
      // let position = { left: newLeft, top: newTop };
      // if (this._activePoint === "tm" || this._activePoint === "bm") {
      //   // 垂直方向 resize, 不会改变宽度
      //   let size = { width: newWidth, height: height };
      //   this.updateElementPAS({ position, size });
      //   return;
      // }
      // if (this._activePoint === "ml" || this._activePoint === "rm") {
      //   // 水平方向 resize, 不会改变高度
      //   let size = { width: newWidth, height: height };
      //   this.updateElementPAS({ position, size });
      //   return;
      // }
      // // 斜向 resize, 方式一样, 统一处理
      // if (this._activePoint === "tl" || this._activePoint === "br") {
      //   // \ 斜向 resize
      //   let size = { width: newWidth, height: height };
      //   this.updateElementPAS({ position, size });
      // }
    },


    resizeStart(event) {
      if (!this.isResizing) return ;
      event.stopPropagation && event.stopPropagation();
    },
  },
  mounted() {
    this._parentNodeSize = this.$el.parentNode ? ({
      width: this.$el.parentNode.clientWidth,
      height: this.$el.parentNode.clientHeight
    }) : null;

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
