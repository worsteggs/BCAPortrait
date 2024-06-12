<template>
  <div class="b-button" :class="comBtnClass" v-bind="$attrs" v-on="$listeners">
    <slot>{{ label }}</slot>
    <slot name="icon"><i :class="icon" v-if="icon != ''"></i></slot>
    <download-csv v-if="downloadCSV" class="download-csv" :data="downloadDEList" :name="fileName + '.csv'" />
  </div>
</template>
<script>
export default {
  name: "BButton",
  props: {
    label: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "primary",
    },
    downloadCSV: {
      type: Boolean,
      default: false,
    },
    downloadDEList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    fileName: {
      type: String,
      default: "fileName",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    comBtnClass () {
      const btnDisabled = this.disabled ? "b-disabled" : "";

      return `${this.type} ${btnDisabled}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.b-button {
  border-radius: 4px;
  padding: 4px 30px;
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
  position: relative;
  .download-csv {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 22;
    opacity: 0;
  }
  &:hover {
    opacity: 0.9;
  }
  i {
    font-size: 20px;
    margin-left: 4px;
    vertical-align: middle;
  }
  &.primary {
    background: $themeColor;
    color: white;
  }
  &.light {
    background: #eff5fe;
    color: #333;
  }
  &.b-disabled {
    cursor: not-allowed;
    background: #dbdbdb;
    // color: #cbcbcb;
  }
  &.text {
    background: none;
    padding: 0;
    margin-right: 0;
  }
  &.default {
    background: none;
    padding: 0;
  }
}
</style>
