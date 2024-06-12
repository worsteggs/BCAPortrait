<template>
  <div class="b-pane-tit">{{ label }}</div>
</template>
<script>
export default {
  name: "BPaneLabel",
  props: {
    label: {
      type: String,
      default: "",
    },
  },
};
</script>
<style lang="scss" scoped>
.b-pane {
  &-tit {
    font-size: 18px;
    color: #333;
    margin-bottom: 5px;
    font-weight: 700;
  }
}
</style>