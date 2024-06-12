<template>
  <el-select
    v-model="selectValue"
    v-bind="$attrs"
    v-on="$listeners"
    no-data-text="No Data"
    @change="
      (value) => {
        $emit('input', value);
        $emit('change', value);
      }
    "
  >
    <el-option v-for="item in dicts" :key="item" :value="item" :label="item" />
  </el-select>
</template>
<script>
export default {
  name: "BSelect",
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    fileName: String,
    returnColumn: {
      type: Array,
      default: () => {
        return [];
      },
    },
    filters: {
      type: Object,
      default: () => {
        return null;
      },
    },
    dataType: String,
    value: String,
  },
  data() {
    return {
      dicts: this.data || [],
      selectValue: this.value,
    };
  },
  watch: {
    value(val) {
      this.selectValue = val;
    },
  },
  methods: {
    async fetchData() {},
  },
  async created() {
    if (this.fileName) {
      const { fileName, filters, returnColumn } = this;
      const param = {
        fileName,
        filters,
        returnColumn,
        isLike: true, //模糊搜索
      };
      const dicts = await this.$store.dispatch("app/fetchDicts", {
        param,
        dataType: this.dataType,
      });
      this.dicts = dicts;
    }
  },
};
</script>
