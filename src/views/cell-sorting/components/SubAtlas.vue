<template>
  <div class="xuanzeClick filter-cell">
    <div style="display: flex">
      <el-checkbox class="filter-check-txt" v-model="params.notFlag">
        Exclude
      </el-checkbox>
      <div>
        <div style="margin-top: 8px">
          <span class="filter-cell-label">Sub-atlas </span>
          <el-select v-model="params.sample_type" style="width: 187px" clearable placeholder="Sub-atlas">
            <el-option v-for="item in SubAtlas" :key="item" :label="item" :value="item" />
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
          cellType: [],
        };
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      SubAtlas: ['Adult', 'Fetal', 'Tumour', 'Organoid', 'Xenograft']
    }
  },
  components: {
    filterIcon: () => import("./filterIcon"),
  },
  methods: {
    // atlasChange (value) {
    //   this.params.sample_type = value
    // }
  }
}
</script>
<style lang="scss" scope>
@import "./filter-cell-scss.scss";
</style>