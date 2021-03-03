import { createStore } from "vuex";
import dragModule from "./drag-module"

const store = createStore({
  state: {},
  modules: {
    dragModule
  }
})

export default store;
