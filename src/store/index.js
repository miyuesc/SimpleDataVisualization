import { createStore } from "vuex";
import activeElement from "./active-element"
import editorScreen from "./editor-screen";
import components from "./components";

const store = createStore({
  state: {},
  modules: {
    activeElement,
    editorScreen,
    components
  }
})

export default store;
