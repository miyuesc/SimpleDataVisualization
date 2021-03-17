import { useStore } from "vuex";
import { computed } from "vue";
import { debounce, throttle } from "./common-utils";

export function mouseMoving(parentNodeSize) {
  const activeElementState = useStore().state.activeElement; // 当前激活的元素
  const editorScreenState = useStore().state.editorScreen;
  const mousedownCoordinator = computed(() => editorScreenState.mousedownCoordinator); // 当前鼠标按下的坐标
  const resizable = computed(() => activeElementState.resizable); // 可缩放
  const movable = computed(() => activeElementState.movable); // 可移动
  const scale = computed(() => editorScreenState.scale); // 缩放比例

  // vuex 缓存更新方法
  // 更新 激活元素的 position and size
  const updateActiveElementState = newState => useStore().commit("activeElement/updatePAS", newState);
  // 更新 components 列表中的 当前元素状态
  const updateComponentInList = newState => useStore().commit("components/update", { newState, index: activeElementState.index });
  // 节流更新 激活状态元素
  const throttleActiveUpdate = throttle(updateActiveElementState,10);
  // 防抖更新 组件状态数组
  const debounceComponentUpdate = debounce(updateComponentInList, 50);

  const throttleUpdate = throttle((newState) => {
    updateActiveElementState(newState);
    updateComponentInList(newState);
  }, 10);

  const computedElementPosition = event => {
    let { size: { width, height } } = activeElementState;
    // 根据鼠标移动距离更新元素的当前位置
    let { x, y, mouseX, mouseY } = mousedownCoordinator.value;
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

  // 鼠标移动事件
  const onMouseMoving = event => {
    if (movable.value) return computedElementPosition(event);
    if (resizable.value) return computedElementSize(event);
  }
}
