const activeElement = {
  namespaced: true,
  state: () => ({
    position: { left: 234, top: 123 }, // 位置
    size: { width: 420, height: 250 }, // 大小
    id: "",
    index: -1,
    visible: false, // 显示状态
    moving: false // 是否移动 => 是否显示指示线
  }),
  getters: {
    activeElementState(state) {
      return state;
    }
  },
  mutations: {
    updateAll(state, newState) {
      // state = JSON.parse(JSON.stringify(newState));
      state.position = { ...newState.position }; // position and size
      state.size = { ...newState.size };
      state.visible = newState.visible;
      state.moving = newState.moving;
      state.id = newState.id;
      state.index = newState.index;
    },
    updatePAS(state, newPAS) {
      state.position = { ...newPAS.position }; // position and size
      state.size = { ...newPAS.size };
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
    updateMoving(state, moving) {
      state.moving = moving;
    },
    updateBase(state, id, index) {
      state.id = id;
      state.index = index;
    }
  }
}

export default activeElement;
