<template>
  <div class="drag-indicator-area" :style="indicatorAreaStyle" @mousedown="handleSelectAndReadyMove($event)">
    <span
      v-for="point in points"
      :key="point"
      :class="`indicator-point indicator-point-${point}`"
      :style="pointsStyle"
      :ref="`point-${point}-ref`"
      @mousedown.stop.prevent="handleToResize(point, $event)"
    ></span>
    <slot></slot>
  </div>
</template>

<script>
import { computed, reactive, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { throttle } from "../../utils/common-utils";

export default {
  name: "DragIndicatorPoints",
  props: { details: Object, index: Number },
  setup(props, context) {
    const store = useStore();
    const editorScreenState = store.state.editorScreen;
    const activeElementState = store.state.activeElement;
    /*
     * [ tl --- tc --- tr ]
     * [  |             | ]
     * [ ml            mr ]
     * [  |             | ]
     * [ bl --- bc --- br ]
     */
    const points = ["tl", "tc", "tr", "ml", "mr", "bl", "bc", "br"]; // 左上角开始顺时针对应的各个指示点
    /* 变量 */
    const parentNodeSize = reactive({ width: 0, height: 0 });
    let _activePoint, _currentPAS, _currentPosition, _throttleUpdate;
    /* 计算属性 */
    const scale = computed(() => editorScreenState.scale);
    const indicatorAreaStyle = computed(() => {
      let { width, height } = props.details.size;
      let { left, top } = props.details.position;
      let bgColor = activeElementState.id === props.details.id ? "#4a71fe" : "#4a71fe00";
      let borderWidth = Math.floor(2 / editorScreenState.scale);
      return `width: ${ width }px; height: ${ height }px; left: ${ left }px; top: ${ top }px; border-color: ${ bgColor }; border-width: ${ borderWidth }px`
    })
    const pointsStyle = computed(() => {
      let display = activeElementState.id === props.details.id ? "block" : "none";
      return `transform: scale(${ 1 / editorScreenState.scale }); display: ${ display }`;
    })
    /* 方法 */
    const updateElementPosition = position => store.commit("activeElement/updatePosition", position);
    const updateElementPAS = pas => store.commit("activeElement/updatePAS", pas);
    const selectedElement = () => {
      let newState = { ...JSON.parse(JSON.stringify(props.details)), visible: true, moving: false};
      store.commit("components/update", { newState, index: props.index });
      store.commit("activeElement/updateAll", newState);
    }
    // 鼠标按下，触发 resize 事件
    const handleToResize = (point, event) => {
      event.stopPropagation();
      _activePoint = point;
      _currentPAS = {
        x: event.target.parentNode.offsetLeft, // 鼠标所在元素 距离父元素左侧 的距离
        y: event.target.parentNode.offsetTop, // 鼠标所在元素 距离父元素上侧 的距离
        width: event.target.parentNode.clientWidth, // 鼠标所在元素 的标记元素 的宽度
        height: event.target.parentNode.clientHeight, // 鼠标所在元素 的标记元素 的高度
        mouseX: event.clientX, // 鼠标处于屏幕的横向位置
        mouseY: event.clientY // 鼠标处于屏幕的纵向位置
      }
    }
    // 鼠标按下，触发 move 事件
    const handleSelectAndReadyMove = (event) => {
      selectedElement();
      _currentPosition = {
        x: event.target.offsetLeft, // 鼠标所在元素 距离父元素左侧 的距离
        y: event.target.offsetTop, // 鼠标所在元素 距离父元素上侧 的距离
        mouseX: event.clientX, // 鼠标处于屏幕的横向位置
        mouseY: event.clientY // 鼠标处于屏幕的纵向位置
      }
    }
    // 鼠标移动状态
    const onMouseMoving = (event) => {
      // 非 moving 或者 resizing 状态 直接返回
      if (!isResizing.value && !isMoving.value) return;
      // 拖拽移动部分
      if (isMoving.value) {
        computedElementPosition(event);
        return;
      }
      // resize 部分
      computedElementSize(event);
    }
    // 鼠标抬起，移除事件与状态
    const onMouseUp = () => {
      if (!isResizing.value && !isMoving.value) return;
      _activePoint = null;
      isResizing.value = false;
      isMoving.value = false;
    }
    // 计算移动距离，更新元素位置
    const computedElementPosition = (event) => {
      let { size } = props.details.size;
      // 根据鼠标移动距离更新元素的当前位置
      let { x, y, mouseX, mouseY } = _currentPosition;
      let left = x + (event.clientX - mouseX) / scale;
      let top = y + (event.clientY - mouseY) / scale;
      // 判断是否还在可视区域内, 不在则重设为合法数值
      if (left < 0) left = 0;
      if (left + size.width > parentNodeSize.width) left = parentNodeSize.width - size.width;
      if (top < 0) top = 0;
      if (top + size.height > parentNodeSize.height) top = parentNodeSize.height - size.height;
      _throttleUpdate("position", { top, left });
    }
    // 计算移动距离，更新元素大小及位置
    const computedElementSize = (event) => {
      let { x, y, width, height, mouseX, mouseY } = _currentPAS;
      let newWidth = width;
      let newHeight = height;
      let newLeft = x;
      let newTop = y;
      let offsetX = (event.clientX - mouseX) / scale; // x 方向偏移量
      let offsetY = (event.clientY - mouseY) / scale; // y 方向偏移量
      // 边界判断
      let isLegalX = (offsetX + x > 0) && (offsetX + x < parentNodeSize.width);
      let isLegalY = (offsetY + y > 0) && (offsetY + y < parentNodeSize.height);
      // 根据 鼠标移动距离 设置 新的高宽
      // 左上, 均会改变
      if (_activePoint === "tl") {
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
      // 中上, newLeft, newWidth 不变
      if (_activePoint === "tc") {
        newHeight = isLegalY ? height - offsetY : height + y;
        if (newHeight > 0) {
          newTop = isLegalY ? y + offsetY : 0;
        } else {
          newTop = height + y;
          newHeight = 0;
        }
      }
      // 右上, newLeft 不变
      if (_activePoint === "tr") {
        let maxWidth = parentNodeSize.width - x;
        newWidth = width + offsetX > maxWidth ? maxWidth : width + offsetX;
        newWidth <= 0 && (newWidth = 0);
        newHeight = isLegalY ? height - offsetY : height + y;
        if (newHeight > 0) {
          newTop = isLegalY ? y + offsetY : 0;
        } else {
          newTop = height + y;
          newHeight = 0;
        }
      }
      // 左中, newTop、newHeight 不变
      if (_activePoint === "ml") {
        let maxWidth = width + x;
        newWidth = width - offsetX > maxWidth ? maxWidth : width - offsetX;
        newLeft = width - offsetX > maxWidth ? 0 : newLeft + offsetX;
        newWidth <= 0 && (newWidth = 0);
        newWidth <= 0 && (newLeft = maxWidth);
      }
      // 右中, newTop、newHeight、newLeft 不变
      if (_activePoint === "mr") {
        let maxWidth = parentNodeSize.width - x;
        newWidth = width + offsetX < maxWidth ? width + offsetX : maxWidth;
        newWidth <= 0 && (newWidth = 0);
      }
      // 下左, newTop 不变
      if (_activePoint === "bl") {
        let maxWidth = width + x;
        newWidth = width - offsetX > maxWidth ? maxWidth : width - offsetX;
        newLeft = width - offsetX > maxWidth ? 0 : newLeft + offsetX;
        newWidth <= 0 && (newWidth = 0);
        newWidth <= 0 && (newLeft = maxWidth);
        let maxHeight = parentNodeSize.height - y;
        newHeight = height + offsetY < maxHeight ? height + offsetY : maxHeight;
        newHeight <= 0 && (newHeight = 0);
      }
      // 下中, newWidth, newTop 不变
      if (_activePoint === "bc") {
        let maxHeight = parentNodeSize.height - y;
        newHeight = height + offsetY < maxHeight ? height + offsetY : maxHeight;
        newHeight <= 0 && (newHeight = 0);
      }
      // 下右, newTop, newLeft 不变
      if (_activePoint === "br") {
        let maxWidth = parentNodeSize.width - x;
        newWidth = width + offsetX < maxWidth ? width + offsetX : maxWidth;
        newWidth <= 0 && (newWidth = 0);
        let maxHeight = parentNodeSize.height - y;
        newHeight = height + offsetY < maxHeight ? height + offsetY : maxHeight;
        newHeight <= 0 && (newHeight = 0);
      }

      let newPAS = {
        position: { left: newLeft, top: newTop },
        size: { width: newWidth || 0, height: newHeight || 0 }
      }
      _throttleUpdate("pas", newPAS);
    }
    // 状态统一更新
    const updateActiveElementState = (type, state) => {
      (type === "position") && (updateElementPosition(state));
      (type === "pas") && (updateElementPAS(state));
    }

    // 生命周期
    onMounted(() => {
      _throttleUpdate = throttle(updateActiveElementState, 10);
      document.documentElement.addEventListener("mousemove", onMouseMoving);
      document.documentElement.addEventListener("mouseup", onMouseUp);
    })
    onBeforeUnmount(() => {
      document.documentElement.removeEventListener("mousemove", onMouseMoving);
      document.documentElement.removeEventListener("mouseup", onMouseUp);
    })

    return {
      parentNodeSize,
      points,
      scale,
      pointsStyle,
      indicatorAreaStyle,
      updateElementPosition,
      updateElementPAS,
      selectedElement,
      handleToResize,
      handleSelectAndReadyMove,
      onMouseMoving,
      onMouseUp,
      computedElementPosition,
      computedElementSize,
      updateActiveElementState
    }
  },
  mounted() {
    this.parentNodeSize = this.$el.parentNode ? ({
      width: this.$el.parentNode.clientWidth,
      height: this.$el.parentNode.clientHeight
    }) : null;

    console.log(this.parentNodeSize);
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
  z-index: 2;
  user-select: none;
  pointer-events: auto;
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
  pointer-events: auto;
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
