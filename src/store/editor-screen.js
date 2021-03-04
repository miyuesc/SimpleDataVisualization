const editorScreen = {
  namespaced: true,
  state: () => ({
    scale: 0.7,
    position: {
      left: 15,
      top: 15
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
    }
  }
}

export default editorScreen;
