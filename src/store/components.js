/* 被选中的组件状态缓存 */
const components = {
  namespaced: true,
  state: () => ({
    components: [
      {
        id: "test-123",
        position: { left: 243, top: 123 },
        size: { width: 367, height: 635 },
        index: 1,
        zIndex: 1,
        visible: false, // 显示状态
        moving: false
      },
      {
        id: "test-1231",
        position: { left: 435, top: 657 },
        size: { width: 787, height: 253 },
        index: 2,
        zIndex: 2,
        visible: false, // 显示状态
        moving: false
      }
    ]
  }),
  getters: {
    selectedComponents(state) {
      return state;
    }
  },
  mutations: {
    add(state, newComponent) {
      state.components.push(JSON.parse(JSON.stringify(newComponent)));
    },
    update(state, { newState, index }) {
      state.components.splice(index, 1, JSON.parse(JSON.stringify(newState)));
    },
    delete(state, component, index) {
      state.components.splice(index, 1);
    }
  }
}

export default components;


