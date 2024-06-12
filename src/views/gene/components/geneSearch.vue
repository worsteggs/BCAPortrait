<template>
  <div class="region-search">
    <!-- <el-select v-if="isMethod" v-model="searchMethods" multiple filterable placeholder="Select" @change="search" style="width: 400px; flex: 1">
      <el-option label="All" value="All"></el-option>
      <el-option v-for="item in listData" :key="item" :label="item" :value="item">
      </el-option>
    </el-select>
    <el-cascader v-else v-model="searchRegion" placeholder="Search" filterable :options="listData" @change="search" style="flex: 1">
      <template #empty>
        <el-empty description="No Data"></el-empty>
      </template>
    </el-cascader> -->

    <el-select v-model="searchRegion" filterable placeholder="Select" no-data-text="No Data" @change="search" style="width: 400px; flex: 1">
      <el-option v-for="item in data" :key="item" :label="item" :value="item">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: "GeneSearch",
  props: {
    value: [String, Array],
    multiple: Boolean,
    data: {
      type: Array,
      default: () => [],
    },
    isMethod: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      searchRegion: this.value,
      searchMethods: [],
      listData: [],
    };
  },
  watch: {
    value (val) {
      if (val instanceof Array) {
        this.searchMethods = val;
      } else this.searchRegion = val;
    },
  },
  methods: {
    search (value) {
      // const _data = this.isMethod ? value : value[value.length - 1];
      this.$emit("input", value);
      this.$emit("change", value);
    },
  },
};
</script>
<style lang="scss" scoped>
.region-search {
  display: flex;
  align-items: center;
}
</style>
