const editorScreen = {
  namespaced: true,
  state: () => ({
    scale: 0.8,
    position: {
      left: 15,
      top: 15
    },
    // 坐标
    mousedownCoordinator: {
      x: 0,
      y: 0,
      mouseX: 0,
      mouseY: 0
    }
  }),
  mutations: {
    updateAll(state, newState) {
      state = JSON.parse(JSON.stringify(newState));
    },
    updateScale(state, newScale) {
      state.scale = newScale;
    },
    updatePosition(state, newPosition) {
      state.position = { ...newPosition };
    },
    updateMDC(state, newMDC) {
      state.mousedownCoordinator = JSON.parse(JSON.stringify(newMDC));
    }
  }
}

export default editorScreen;
