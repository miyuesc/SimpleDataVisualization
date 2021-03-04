import { createStore } from "vuex";
import activeElement from "./active-element"

const store = createStore({
  state: {},
  modules: {
    dragModule: activeElement
  }
})

export default store;
