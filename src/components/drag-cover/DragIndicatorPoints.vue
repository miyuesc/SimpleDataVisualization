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
import {throttle} from "../../utils/common-utils";

export default {
  name: "DragIndicatorPoints",
  setup() {
    const store = useStore();
    const activeElementState = store.state.activeElement
    const editorScreenState = store.state.editorScreen;

    /*
     * [ tl --- tc --- tr ]
     * [  |             | ]
     * [ ml            mr ]
     * [  |             | ]
     * [ bl --- bc --- br ]
     */
    const points = ["tl", "tc", "tr", "ml", "mr", "bl", "bc", "br"]; // 左上角开始顺时针对应的各个指示点

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
      console.log("newSize:", width, height);
      return `width: ${ width }px; height: ${ height }px; left: ${ left }px; top: ${ top }px; border-width: ${Math.floor(2 / editorScreenState.scale)}px`
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
      this._currentPAS = {
        x: event.target.parentNode.offsetLeft, // 鼠标所在元素 距离父元素左侧 的距离
        y: event.target.parentNode.offsetTop, // 鼠标所在元素 距离父元素上侧 的距离
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
      this._throttleUpdate("position", { top, left });
    },
    // 计算移动距离，更新元素大小及位置
    computedElementSize(event) {
      let { x, y, width, height, mouseX, mouseY } = this._currentPAS;
      let newWidth = width;
      let newHeight = height;
      let newLeft = x;
      let newTop = y;
      let offsetX = (event.clientX - mouseX) / this.scale; // x 方向偏移量
      let offsetY = (event.clientY - mouseY) / this.scale; // y 方向偏移量
      // 边界判断
      let isLegalX = (offsetX + x > 0) && (offsetX + x < this._parentNodeSize.width);
      let isLegalY = (offsetY + y > 0) && (offsetY + y < this._parentNodeSize.height);
      // 根据 鼠标移动距离 设置 新的高宽
      // 左上, 均会改变
      if (this._activePoint === "tl") {
        newWidth = isLegalX ? width - offsetX : width + x;
        if (newWidth > 0) {
          newLeft = isLegalX ? x + offsetX : 0;
        } else {
          newLeft = width + x;
          newWidth = 0;
        }
        newHeight = isLegalY ? height - offsetY : height + y;
        if (newHeight > 0) {
          newTop = isLegalY ? y + offsetY : 0;
        } else {
          newTop = height + y;
          newHeight = 0;
        }
      }
      // 中上, 纵向改变
      if (this._activePoint === "tc") {
        newHeight = isLegalY ? height - offsetY : height + y;
        if (newHeight > 0) {
          newTop = isLegalY ? y + offsetY : 0;
        } else {
          newTop = height + y;
          newHeight = 0;
        }
      }
      // 右上, x、newLeft 不变
      if (this._activePoint === "tr") {
        let maxWidth = this._parentNodeSize.width - x;
        newWidth = width + offsetX > maxWidth ? maxWidth : width + offsetX;
        newWidth < 0 && (newWidth = 0);
        newHeight = isLegalY ? height - offsetY : height + y;
        if (newHeight > 0) {
          newTop = isLegalY ? y + offsetY : 0;
        } else {
          newTop = height + y;
          newHeight = 0;
        }
      }
      // 左中, y、newTop、newHeight 不变
      if (this._activePoint === "ml") {
        let maxWidth = width + x;
        newWidth = width - offsetX > maxWidth ? maxWidth : width - offsetX;
        newLeft = width - offsetX > maxWidth ? 0 : newLeft + offsetX;
        newWidth <= 0 && (newWidth = 0);
        newWidth <= 0 && (newLeft = maxWidth);
      }
      // 右中, y、newTop、newHeight 不变
      if (this._activePoint === "mr") {}
      // 下左
      if (this._activePoint === "bl") {}
      // 下中
      if (this._activePoint === "bc") {}
      // 下右
      if (this._activePoint === "br") {}

      let newPAS = {
        position: { left: newLeft, top: newTop },
        size: { width: newWidth || 0, height: newHeight || 0 }
      }
      this._throttleUpdate("pas", newPAS);
    },
    // 状态统一更新
    updateActiveElementState(type, state) {
      (type === "position") && (this.updateElementPosition(state));
      (type === "pas") && (this.updateElementPAS(state));
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

    this._throttleUpdate = throttle(this.updateActiveElementState, 10);

    document.documentElement.addEventListener("mousemove", this.onMouseMoving);
    document.documentElement.addEventListener("touchmove", this.onMouseMoving, true);

    document.documentElement.addEventListener("mouseup", this.onMouseUp);
    document.documentElement.addEventListener("touchend touchcancel", this.onMouseUp, true);
  },
  beforeUnmount() {
    document.documentElement.removeEventListener("mousemove", this.resizeStart);
    document.documentElement.removeEventListener("touchmove", this.resizeStart, true);

    document.documentElement.removeEventListener("mouseup", this.onMouseUp);
    document.documentElement.removeEventListener("touchend touchcancel", this.onMouseUp, true);
  }
}
</script>

<style scoped lang="scss">
.drag-indicator-area {
  position: absolute;
  background: none;
  //box-sizing: border-box;
  outline: none;
  border-style: solid;
  border-color: #4a71fe;
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
.indicator-point-tc {
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
.indicator-point-ml {
  top: 50%;
  left: -4px;
  &:hover {
    cursor: w-resize;
  }
}
.indicator-point-mr {
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
.indicator-point-bc {
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
