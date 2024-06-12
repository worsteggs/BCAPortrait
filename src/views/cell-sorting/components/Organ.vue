<template>
  <div class="xuanzeClick filter-cell">
    <div style="display: flex">
      <el-checkbox class="filter-check-txt" v-model="params.notFlag">
        Exclude
      </el-checkbox>
      <div>
        <!-- <div>
          <span class="filter-cell-label">Organ </span>
          <el-input value="Heart" readonly style="width: 187px"></el-input>
        </div> -->
        <div style="margin-top: 8px">
          <span class="filter-cell-label">Region </span>
          <el-select v-model="params.region" style="width: 187px" clearable @change="regionChange" placeholder="Region">
            <el-option v-for="item in orginRegion" :key="item.key" :label="item.label" :value="item.label" />
          </el-select>
        </div>
        <div style="margin-top: 8px">
          <span class="filter-cell-label">Subregion </span>
          <el-select v-model="subregion" clearable style="width: 187px" @change="(value) => (params.subregion = value)" placeholder="Subregion">
            <el-option v-for="item in orginSubregion" :key="item.key" :label="item.label" :value="item.label" />
          </el-select>
        </div>
      </div>
    </div>
    <filterIcon questionTip="Select cells from one or several organs" @close="$emit('close')" />
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      default: function () {
        return {
          organ: ["Brain"],
          notFlag: false,
        };
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
  data () {
    return {
      zNodes: [],
      defaultCheckedKeys: [],
      filterText: "",
      cellCheck: true,
      cellStrictly: false,
      orginNodes: [],
      orginRegion: [],
      orginSubregion: [],
      region: "",
      subregion: "",
      regionParent: {},
    };
  },
  watch: {
    // filterText(val) {
    //   if (val && val.trim()) { this.$refs.tree.filter(val) }
    // },
    // "params.organ": "organsWatch",
  },
  async created () {
    const node = await this.$store.dispatch(
      "cellCollection/fetchOrgantree",
      "Brain"
    );
    console.log("000000000", node);
    this.orginRegion = node.map((val) => {
      return { label: val, value: val };
    });
  },
  mounted () {
    this.params.organ = ["Brain"];
    this.subregion = this.params.subregion;
  },
  methods: {
    async regionChange (value) {
      this.subregion = ""; // 初始化值
      this.params.subregion = "";
      const orginSubregion = await this.$store.dispatch(
        "cellCollection/fetchOrgantree",
        value
      );
      this.orginSubregion = orginSubregion.map((val) => {
        return { label: val, value: val };
      });
      // this.orginSubregion = this.orginRegion.find(
      //   (item) => item.label === value
      // ).children;
    },
  },
};
</script>

<style lang="scss" scope>
@import "./filter-cell-scss.scss";
</style>
