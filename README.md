# SimpleDataVisualization
 数据可视化简易Demo


vuex state:

1. components 存放所有组件状态
2. activeElement 当前激活状态的组件
3. editorScreen 画布区域缩放状态


drag & resize 组件：

1. mousedown: 更新 activeElement, 使用activeElement来变更组件样式
2. on dragging & resizing: throttle(fn, 16) 节流更新 activeElement
3. drag & resize end: debounce(fn, 100) 防抖更新 components


guide lines 组件：

根据 activeElement 的状态来更新显示状态与样式

