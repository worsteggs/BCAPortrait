<template>
  <div align="center" style="display: inline-block">
    <div class="brain-img" :class="{ gene: isGene, active: geneActive }" v-bind="$attrs" v-on="$listeners">
      <slot />
    </div>
    <slot name="label">
      <p class="label">{{ label }}</p>
    </slot>
  </div>
</template>
<script>
export default {
  name: "BrainImgWrap",
  props: {
    label: {
      type: String,
      default: "",
    },
    isGene: {
      type: Boolean,
      default: false,
    },
    geneActive: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.brain-img {
  // width: calc(100% - 16px);
  // height: calc(100% - 16px);
  max-width: 100%;
  // max-height: 250px;
  border-radius: 100%;
  background: #f7f7f7;
  border: 8px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 32px;
  overflow: hidden;
  &:hover {
    img {
      transform: scale(1.1);
    }
  }
  img {
    width: 100%;
    transition: all 0.3s;
  }
  &.gene {
    border-width: 4px;
  }
  &.active {
    border-color: #23265f;
    background: #f7f7f7;
  }
}
.label {
  color: $logoColor;
  font-size: 30px;
  font-weight: bold;
  line-height: 1em;
}
</style>
