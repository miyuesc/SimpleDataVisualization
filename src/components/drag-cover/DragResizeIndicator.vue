<template>
  <div class="drag-indicator-area" :style="indicatorAreaStyle">
    <span
      v-for="point in points"
      :key="point"
      :class="`indicator-point indicator-point-${point}`"
      :style="pointsStyle"
      @mousedown.stop.prevent="handleToResize(point, $event)"
    ></span>
    <slot></slot>
  </div>
</template>

<script>
import { computed, reactive, ref, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { debounce, throttle } from "../../utils/common-utils";

export default {
  name: "DragIndicatorPoints",
  setup() {
    const store = useStore();
    const editorScreenState = store.state.editorScreen;
    const activeElementState = store.state.activeElement;
    /*
     * 边框上的点标记，可触发 resize
     * [ tl --- tc --- tr ]
     * [  |             | ]
     * [ ml            mr ]
     * [  |             | ]
     * [ bl --- bc --- br ]
     */
    const points = ["tl", "tc", "tr", "ml", "mr", "bl", "bc", "br"];
    // 变量
    const parentNodeSize = reactive({ width: 0, height: 0 }); // 父元素的高宽
    let activePoint; // 当前激活的某个 point
    let currentPAS; // 改变之前的大小

    const isResizable = computed(() => activeElementState.resizable);
    const isMovable = computed(() => activeElementState.movable);
    const mousedownMDC = computed(() => editorScreenState.mousedownCoordinator);

    // vuex 缓存更新方法
    // 更新 激活元素的 position and size
    const updateActiveElementState = newState => store.commit("activeElement/updatePAS", newState);
    // 更新 components 列表中的 当前元素状态
    const updateComponentInList = newState => store.commit("components/update", { newState, index: activeElementState.index });
    // 节流更新 激活状态元素
    const throttleActiveUpdate = throttle(updateActiveElementState,5);
    const debounceComponentUpdate = debounce(updateComponentInList, 50);

    const throttleUpdate = throttle((newState) => {
      updateActiveElementState(newState);
      updateComponentInList(newState);
    }, 5)
    //
    // 样式计算属性
    const scale = computed(() => editorScreenState.scale); // 缩放
    const isActive = computed(() => activeElementState.visible); // 是否当前激活元素
    // border 样式
    const indicatorAreaStyle = computed(() => {
      let { size: { width, height }, position: { left, top }, zIndex } = activeElementState;
      let bgColor = isActive.value ? "#4a71fe" : "#4a71fe00";
      let borderWidth = Math.floor(2 / scale.value);
      return {
        width: `${ width }px`,
        height: `${ height }px`,
        left: `${ left }px`,
        top: `${ top }px`,
        borderColor: bgColor,
        borderWidth: `${ borderWidth }px`,
        zIndex
      }
    });
    // points 样式
    const pointsStyle = computed(() => {
      let display = isActive.value ? "block" : "none";
      return `transform: scale(${ 1 / scale.value }); display: ${ display }`;
    });

    // 选中point并准备进行大小改变, 记录初始状态（需要阻止冒泡）
    const handleToResize = (point, event) => {
      event.stopPropagation();
      store.commit("activeElement/updateResizable", true);
      activePoint = point;
      currentPAS = {
        x: event.target.parentNode.offsetLeft, // 鼠标所在元素 距离父元素左侧 的距离
        y: event.target.parentNode.offsetTop, // 鼠标所在元素 距离父元素上侧 的距离
        width: event.target.parentNode.clientWidth, // 鼠标所在元素 的标记元素 的宽度
        height: event.target.parentNode.clientHeight, // 鼠标所在元素 的标记元素 的高度
        mouseX: event.clientX, // 鼠标处于屏幕的横向位置
        mouseY: event.clientY // 鼠标处于屏幕的纵向位置
      }
    }
    // 鼠标移动状态
    const onMouseMoving = (event) => {
      if (isMovable.value) return computedElementPosition(event);
      if (isResizable.value) return computedElementSize(event);
    }
    // 鼠标抬起，移除事件与状态
    const onMouseUp = () => {
      if (!isResizable.value && !isMovable.value) return;
      activePoint = null;
      store.commit("activeElement/updateMovable", false);
      store.commit("activeElement/updateResizable", false);
    }
    // 计算移动距离，更新元素大小及位置
    const computedElementSize = event => {
      let { x, y, width, height, mouseX, mouseY } = currentPAS;
      let newWidth = width;
      let newHeight = height;
      let newLeft = x;
      let newTop = y;
      let offsetX = (event.clientX - mouseX) / scale.value; // x 方向偏移量
      let offsetY = (event.clientY - mouseY) / scale.value; // y 方向偏移量
      // 边界判断
      let isLegalX = (offsetX + x > 0) && (offsetX + x < parentNodeSize.width);
      let isLegalY = (offsetY + y > 0) && (offsetY + y < parentNodeSize.height);
      // 根据 鼠标移动距离 设置 新的高宽
      // 左上, 均会改变
      if (activePoint === "tl") {
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
      if (activePoint === "tc") {
        newHeight = isLegalY ? height - offsetY : height + y;
        if (newHeight > 0) {
          newTop = isLegalY ? y + offsetY : 0;
        } else {
          newTop = height + y;
          newHeight = 0;
        }
      }
      // 右上, newLeft 不变
      if (activePoint === "tr") {
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
      if (activePoint === "ml") {
        let maxWidth = width + x;
        newWidth = width - offsetX > maxWidth ? maxWidth : width - offsetX;
        newLeft = width - offsetX > maxWidth ? 0 : newLeft + offsetX;
        newWidth <= 0 && (newWidth = 0);
        newWidth <= 0 && (newLeft = maxWidth);
      }
      // 右中, newTop、newHeight、newLeft 不变
      if (activePoint === "mr") {
        let maxWidth = parentNodeSize.width - x;
        newWidth = width + offsetX < maxWidth ? width + offsetX : maxWidth;
        newWidth <= 0 && (newWidth = 0);
      }
      // 下左, newTop 不变
      if (activePoint === "bl") {
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
      if (activePoint === "bc") {
        let maxHeight = parentNodeSize.height - y;
        newHeight = height + offsetY < maxHeight ? height + offsetY : maxHeight;
        newHeight <= 0 && (newHeight = 0);
      }
      // 下右, newTop, newLeft 不变
      if (activePoint === "br") {
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

      throttleActiveUpdate({ ...activeElementState, ...newPAS });
      debounceComponentUpdate({ ...activeElementState, ...newPAS, moving: false });
    }
    // 计算移动距离，重设元素位置
    const computedElementPosition = event => {
      let { size: { width, height } } = activeElementState;
      // 根据鼠标移动距离更新元素的当前位置
      let { x, y, mouseX, mouseY } = mousedownMDC.value;
      let newLeft = x + (event.clientX - mouseX) / scale.value;
      let newTop = y + (event.clientY - mouseY) / scale.value;
      // 判断是否还在可视区域内, 不在则重设为合法数值
      if (newLeft < 0) newLeft = 0;
      if (newLeft + width > parentNodeSize.width) newLeft = parentNodeSize.width - width;
      if (newTop < 0) newTop = 0;
      if (newTop + height > parentNodeSize.height) newTop = parentNodeSize.height - height;

      let newPAS = {
        position: { left: newLeft, top: newTop }
      }

      throttleUpdate({ ...activeElementState, ...newPAS });
    }


    // 生命周期钩子, 事件监听器的初始化与移除, 更新父元素状态
    onMounted(() => {
      const { ctx: instance} = getCurrentInstance();
      parentNodeSize.width = instance.$el.parentNode.clientWidth;
      parentNodeSize.height = instance.$el.parentNode.clientHeight;
      document.documentElement.addEventListener("mousemove", onMouseMoving);
      document.documentElement.addEventListener("mouseup", onMouseUp);
    })
    onBeforeUnmount(() => {
      document.documentElement.removeEventListener("mousemove", onMouseMoving);
      document.documentElement.removeEventListener("mouseup", onMouseUp);
    })

    return {
      points,
      indicatorAreaStyle,
      pointsStyle,
      handleToResize
    }
  }
}
</script>

<style scoped lang="scss">
.drag-indicator-area {
  position: absolute;
  background: none;
  outline: none;
  box-sizing: border-box;
  border-style: solid;
  z-index: 2;
  user-select: none;
  pointer-events: none;
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
