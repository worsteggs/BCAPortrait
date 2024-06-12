<template>
  <div class="filter-cell">
    <div>
      <el-checkbox class="filter-check-txt" v-model="params.notFlag">
        Exclude
      </el-checkbox>
      <span class="filter-cell-label">gene</span>

      <el-select
        v-model="params.gene"
        style="width: 160px"
        :disabled="disabled"
        filterable
        remote
        reserve-keyword
        placeholder="Filter by name"
        :remote-method="fetchGenes"
        :loading="loading"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      &nbsp;min
      <el-input
        style="width: 100px"
        v-model="params.min"
        placeholder="min"
        clearable
      ></el-input>
      &nbsp;max
      <el-input
        style="width: 100px"
        v-model="params.max"
        placeholder="max"
        clearable
      ></el-input>
    </div>
    <filterIcon questionTip="Select cells that has certain gene express level within a range" @close="$emit('close')" />
  </div>
</template>
<script>
import { postCSV } from "@/api/system.js";
export default {
  props: {
    params: {
      type: Object,
      default: function () {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    filterIcon: () => import("./filterIcon"),
  },
  data() {
    return {
      loading: false,
      options: [],
    };
  },
  mounted() {
    this.fetchGenes("A");
  },
  methods: {
    async fetchGenes(value = "") {
      this.loading = true;
      const result = await postCSV({
        fileName: "csv/genes.csv",
        filters: [
          {
            column: "x",
            filter: value,
            isLike: true,
          },
        ],
        returnColumn: ["x"],
        maxLength: 20,
      });
      this.options = result.x.map((val) => {
        return { value: val, name: val };
      });
      this.loading = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./filter-cell-scss.scss";
</style>
