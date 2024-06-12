<template>
  <div class="b-pane" :class="{ cursor }">
    <slot name="label">
      <BPaneLabel v-if="label != ''" :label="label"></BPaneLabel>
    </slot>
    <slot name="desc"></slot>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "BPane",
  props: {
    label: {
      type: String,
      default: "",
    },
    cursor: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    BPaneLabel: () => import("./BPaneLabel.vue"),
  },
};
</script>
<style lang="scss" scoped>
.b-pane {
  border-radius: 20px;
  padding: 24px;
  background: white;
  margin-top: 20px;
  &.cursor {
    cursor: pointer;
  }
  .pane-desc {
    font-size: 16px;
    color: #666;
    margin-bottom: 16px;
  }
}
</style>
