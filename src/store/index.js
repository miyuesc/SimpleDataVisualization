import { createStore } from "vuex";
import activeElement from "./active-element"
import editorScreen from "./editor-screen";

const store = createStore({
  state: {},
  modules: {
    activeElement,
    editorScreen
  }
})

export default store;
