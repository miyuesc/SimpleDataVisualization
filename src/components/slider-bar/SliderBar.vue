<template>
  <div class="slider-bar" ref="sliderRef" @click.stop="openChildrenPenal">
    <div class="component-type-button" v-for="i in presetComponentsList" :key="'type' + i.icon" :id="'type-'+i.icon">
      <svg class="component-type-button__icon" aria-hidden="true" style="pointer-events: none">
        <use :xlink:href="`#${i.icon}`"></use>
      </svg>
    </div>
    <div class="component-support-list">
      <div class="component-support-item" v-for="p in Object.keys(selectedComponentType)" :key="p"></div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import PresetComponents from "../../utils/preset-components"

export default {
  name: "SliderBar",
  setup() {
    const presetComponentsList = PresetComponents;
    let selectedComponentType = reactive({});

    const openChildrenPenal = ({ target }) => {
      selectedComponentType = presetComponentsList[target.id];
    }

    return {
      presetComponentsList,
      selectedComponentType,
      openChildrenPenal
    }
  }
}
</script>

<style lang="scss" scoped>
.slider-bar {
  width: 48px;
  height: 100%;
  background: #ccf2f4;
  z-index: 2;
  position: relative;
  .component-type-button {
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    position: relative;
    &:hover {
      cursor: pointer;
      background: #00b9ff22;
    }
    &.is-selected {
      background: #00b9ff22;
      &:before {
        content: "";
        width: 2px;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: #4a71fe;
      }
    }
    .component-type-button__icon {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 25%;
    }
  }
  .component-support-list {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 320px;
    transform: translateX(102%);
    z-index: 2;
    background: #ccf2f4;
  }
}
</style>
