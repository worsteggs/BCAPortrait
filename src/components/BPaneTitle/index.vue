<template>
  <div class="pane-title" :class="{center}">
    {{ label }}
  </div>
</template>
<script>
export default {
  name: "BPaneTitle",
  props: {
    label: {
      type: String,
      default: "",
    },
    center: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.pane-title {
  font-size: 48px;
  color: #23255f;
  margin: 40px 0;
  font-weight: bold;
  // @include wrapPadding;
  &.center {
    text-align: center;
  }
}
</style>
