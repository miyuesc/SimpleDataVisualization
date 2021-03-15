const presetComponents = {
  // 图表
  charts: {
    name: "图表",
    icon: "dv-xuritu",
    children: {
      lineCharts: {}, // 折线图
      barCharts: {}, // 柱状/条形图
      pieCharts: {}, // 扇形/饼图
      radarCharts: {}, // 雷达图
      treeCharts: {}, // 树形图
      kCharts: {}, // K 线图
      gaugeCharts: {}, // 仪表盘
      funnelCharts: {} // 漏斗图
    }
  },
  // 文本
  text: {
    name: "文本",
    icon: "dv-text",
    children: {
      title: {},
      area: {},
      content: {}
    }
  },
  // 多媒体
  media: {
    name: "多媒体",
    icon: "dv-media",
    children: {
      picture: {},
      video: {},
      voice: {}
    }
  },
  // 形状
  shape: {
    name: "形状",
    icon: "dv-shape",
    children: {
      rectangle: {},
      circle: {},
      triangle: {}
    }
  },
  // 数据展示
  data: {
    name: "数据展示",
    icon: "dv-data",
    children: {
      list: {},
      table: {}
    }
  },
  // 地图
  map: {
    name: "地图",
    icon: "dv-map",
    children: {
      worldMap: {}
    }
  }
}

export default presetComponents;
