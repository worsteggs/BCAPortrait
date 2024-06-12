<template>
  <div class="page-title">
    {{ label }}
  </div>
</template>
<script>
export default {
  name: "BPagetitle",
  props: {
    label: {
      type: String,
      default: "Cell sorting",
    },
  },
};
</script>
<style lang="scss" scoped>
.page-title {
  font-size: 32px;
  color: $themeColor;
  margin: 40px 0;
  font-weight: 700;
  @include wrapPadding;
}
</style>
