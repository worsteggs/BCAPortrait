<template>
  <div class="icon-wrap">
    <i class="filter-icon filter-icon-qus" :title="questionTip">?</i>
    <i class="filter-icon filter-icon-del" @click="$emit('close')">x</i>
  </div>
</template>
<script>
export default {
  props: {
    questionTip: String
  }
}
</script>
<style lang="scss" scoped>
.icon-wrap {
  display: flex;
  align-items: start;
}
$filter-icon-width: 20px;
.filter-icon {
  border: 2px solid $borderColor;
  display: inline-block;
  height: $filter-icon-width;
  width: $filter-icon-width;
  border-radius: 100%;
  text-align: center;
  line-height: $filter-icon-width;
  font-style: normal;
  margin-left: 10px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  &.filter-icon-qus {
    border-color: $themeColor;
    color: $themeColor;
  }
  &.filter-icon-del {
    border-color: $redColor;
    color: $redColor;
    line-height: $filter-icon-width - 2;
  }
}
</style>
