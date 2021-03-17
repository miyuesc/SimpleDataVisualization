const activeElement = {
  namespaced: true,
  state: () => ({
    position: { left: 0, top: 0 }, // 位置
    size: { width: 0, height: 0 }, // 大小
    id: "",
    index: -1,
    visible: false, // 显示状态
    resizable: false, // 是否准备缩放
    movable: false // 是否移动 => 是否显示指示线
  }),
  getters: {
    activeElementState(state) {
      return state;
    }
  },
  mutations: {
    updateAll(state, newState) {
      state.position = { ...newState.position }; // position and size
      state.size = { ...newState.size };
      state.visible = newState.visible;
      state.movable = newState.movable;
      state.resizable = newState.resizable;
      state.id = newState.id;
      state.index = newState.index;
    },
    updatePAS(state, { position, size }) {
      state.position = { ...position }; // position and size
      state.size = { ...size };
    },
    updatePosition(state, newPosition) {
      state.position = { ...newPosition };
    },
    updateSize(state, newSize) {
      state.size = { ...newSize };
    },
    updateVisible(state, visible) {
      state.visible = visible;
    },
    updateMovable(state, movable) {
      state.movable = movable;
    },
    updateResizable(state, resizable) {
      state.resizable = resizable;
    },
    updateBase(state, { id, index }) {
      state.id = id;
      state.index = index;
    }
  }
}

export default activeElement;
