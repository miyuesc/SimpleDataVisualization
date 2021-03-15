# SimpleDataVisualization
 数据可视化简易Demo


## 1. vuex state 状态管理:

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

```javascript
const activeElement = {
    position: { left: 0, top: 0 }, // 位置
    size: { width: 0, height: 0 }, // 大小
    id: "",
    index: -1,
    visible: false, // 显示状态
    moving: false // 是否移动 => 是否显示指示线
}
```

3. editorScreen 画布区域各种状态

```javascript
const editorScreen = {
    scale: 0.8,
    position: {
      left: 15,
      top: 15
    },
    // 鼠标按下时坐标
    mousedownCoordinator: {
      x: 0,
      y: 0,
      mouseX: 0,
      mouseY: 0
    }
}
```



## 2. 组件


### 1. resize (DragResizeIndicator) 组件：

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


### 2. guide lines (DragGuideLines) 组件：

根据 activeElement state.moving 的状态来更新显示状态与样式


### 3. components canvas (ComponentsCanvas) 图表画布区域：

根据 vuex components 遍历生成图表元素 component

1. component mousedown： 元素的鼠标事件, 更新 activeElement 的内容, 并更新边框事件，准备进行拖拽位移（需阻止冒泡）
2. canvas mousedown： 画布点击事件，更新 activeElement 状态，移除元素焦点样式与移动状态

### 4. preset slider bar（SliderBar）组件：

提供预设图表图例，并实现拖拽新增

1. mousedown: 图例元素事件，准备进行拖拽新增，记录当前坐标
2. 



## 3. 操作记录栈

### 1. 操作栈设计

```javascript

```

