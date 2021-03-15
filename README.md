# SimpleDataVisualization
 数据可视化简易Demo


### 1. vuex state:

1. components 存放所有组件状态
    ```js
     const components = [
        {
           id: "",
           position: { left: 200, top: 200 },
           // ...
        }
        // ...
     ]
    ```
2. activeElement 当前激活状态的组件
3. editorScreen 画布区域各种状态


### 2. resize (DragResizeIndicator) 组件：

1. mousedown: 
    - 只提供8个缩放点的事件，并阻止冒泡
    
2. mousemove: on dragging or resizing
    - throttle(fn, 5) 节流更新： activeElement / position and size 位置和大小
    - debounce(fn, 100) 防抖更新： components / update, 替换当前元素状态
    
3. mouseup: drag or resize end (重点事件)
    - 拖拽位移 或者 大小缩放
        1. 更新 components 与 activeElement 的最新状态
        2. activeElement / updateMoving 移除拖拽状态（后续整合到 1. 上）
    - 拖拽新增图表元素
        1. 更新 components 与 activeElement 的最新状态（插入与赋值）


### 3. guide lines (DragGuideLines) 组件：

根据 activeElement state.moving 的状态来更新显示状态与样式


### 4. components canvas 组件画布区域

根据 vuex components 遍历生成图表元素 component

1. component mousedown： 元素的鼠标事件, 更新 activeElement 的内容, 并更新边框事件，准备进行拖拽位移
