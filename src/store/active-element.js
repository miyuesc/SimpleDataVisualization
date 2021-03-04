const activeElement = {
  namespaced: true,
  state: () => ({
    position: { left: 40, top: 40 }, // 位置
    size: { width: 420, height: 250 }, // 大小
    visible: true, // 显示状态
    moving: true // 是否移动 => 是否显示指示线
  }),
  getters: {
    activeElementState(state) {
      return state;
    }
  },
  mutations: {
    UPDATE_ALL(state, newDragState) {
      state = JSON.parse(JSON.stringify(newDragState));
    },
    UPDATE_POSITION(state, newPosition) {
      state.position = { ...newPosition };
    },
    UPDATE_SIZE(state, newSize) {
      state.position = { ...newSize };
    },
    UPDATE_VISIBLE(state, visible) {
      state.visible = visible;
    },
    UPDATE_MOVING(state, moving) {
      state.moving = moving;
    }
  }
}

export default activeElement;
