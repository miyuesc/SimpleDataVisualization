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
    updateAll(state, newState) {
      state = JSON.parse(JSON.stringify(newState));
    },
    updatePosition(state, newPosition) {
      state.position = { ...newPosition };
    },
    updateSize(state, newSize) {
      state.position = { ...newSize };
    },
    updateVisible(state, visible) {
      state.visible = visible;
    },
    updateMoving(state, moving) {
      state.moving = moving;
    }
  }
}

export default activeElement;
