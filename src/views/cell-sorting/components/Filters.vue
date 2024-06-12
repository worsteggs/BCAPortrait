<template>
  <b-pane class="filter-wrap" label="Filters">
    <div v-show="!(sampleType&&currentStep.stepOrder===0)">
      <div v-for="(orFilter, index) in orFilters" :key="index" :class="{ 'filter-or-box': index > 0 }">
        <div v-if="index > 0" class="filter-tit">
          Or
          <i class="filter-icon filter-icon-del" @click="closeOrFilter(index)">
            x
          </i>
        </div>
        <div>
          <b-button class="filter-button" label="Add Filter" icon="el-icon-circle-plus" @click="doFilterSelect($event, index)"></b-button>
          <!-- <el-checkbox class="filter-check-txt">exclude_unclassified</el-checkbox> -->
        </div>
        <component v-for="(filter, index2) in orFilter" :key="index2" :is="filter.type" :params="filter.params" @close="filterColse(orFilter, index2)"></component>
      </div>
      <b-button class="filter-or-button" icon="el-icon-circle-plus-outline" @click="addOrFilter()">Or</b-button>
      <el-divider class="divider"></el-divider>
    </div>
    <b-button class="filter-button filter-button-apply" @click="apply()">
      Apply
    </b-button>

    <div ref="filterSelect" class="filter-menu" v-show="showFilter" v-clickoutside="handleFilterClose">
      <span v-for="filterType in filterTypes" :key="filterType.name" @click="addFilter(filterType.val)" class="filter-menu-item">{{ filterType.name }}</span>
    </div>
  </b-pane>
</template>
<script>
import { filterCheck } from "./filterUtil";
import { Message } from "element-ui";
import { fetchPortraitXlsx } from './portrait2cellsortingUtil.js';
export default {
  inject: ["cellsort"],
  components: {
    CellType: () => import("./cellType.vue"),
    Metadata: () => import("./metadata.vue"),
    Gene: () => import("./gene.vue"),
    Organ: () => import("./Organ.vue"),
    'sample_type': () => import("./SubAtlas.vue"),
  },
  data () {
    return {
      // filterTypes: ["Organ", "CellType", "Gene", "Metadata"],
      filterTypes: [
        // {
        //   name: 'Anatomical region',
        //   val: 'Organ'
        // },
        // {
        //   name: 'CellType',
        //   val: 'CellType'
        // },
        {
          name: 'Sub-atlas',
          val: 'sample_type'
        },
        {
          name: 'Gene',
          val: 'Gene'
        },
        {
          name: 'Metadata',
          val: 'Metadata'
        }
      ],
      filterMenu: "",
      notFilters: [],
      showFilter: false,
      currentAddFilterIndex: 0,
      filterNum: 0,
    };
  },
  computed: {
    portraitCellsorting () {
      return this.$store.state.cellCollection.portraitCellsorting;
    },
    sampleType () {
      return this.$route.query.sample_type
    },
    steps () {
      return this.$store.state.cellCollection.steps;
    },
    orFilters () {
      return this.currentStep.filters;
    },
    currentStep () {
      return this.$store.state.cellCollection.currentStep;
    },
    processErrorText () {
      return this.currentStep.errorMsg;
    },
  },
  methods: {
    // 格式：((cl_name==NA&&(organ==Heart&&region == Atrium&&subregion == Left atrium)&&(gene_A12M3<=22&&gene_A12M3>=1)&&region==Mid)||(organ==Blood&&region == Cord blood))
    commFilters (filters) {
      let filterStr = "";
      filters.forEach((filter) => {
        let params = filter.params;
        console.log('-----------------', params)
        let excludeStr =
          params.notFlag || params.notFlag == "true" ? "<>" : "==";
        if (filter.type === "Metadata") {
          filterStr += `&&${params[Object.keys(params)[0]]}${excludeStr}${params[Object.keys(params)[1]]
            }`;
        }
        if (filter.type === "sample_type") {
          let atlasStr = "";
          Object.keys(params).forEach((key, index) => {
            if (key !== "notFlag") {
              let str = `${key}${excludeStr}${params[key]}`;
              if (!!params[key] && params[key] != "") {
                atlasStr += `${index > 0 ? "&&" : ""}${str}`;
              }
            }
          });
          filterStr += `&&(${atlasStr})`;
        }
        if (filter.type === "Organ") {
          let organStr = "";
          Object.keys(params).forEach((key, index) => {
            if (key !== "notFlag") {
              let str = `${key}${excludeStr}${params[key]}`;
              if (!!params[key] && params[key] != "") {
                organStr += `${index > 0 ? "&&" : ""}${str}`;
              }
            }
          });
          filterStr += `&&(${organStr})`;
        }
        if (filter.type === "Gene") {
          const maxFlag = params.notFlag ? ">" : "<=";
          const minFlag = params.notFlag ? "<" : ">=";
          filterStr += `&&(${params.gene}${maxFlag}${params.max}&&${params.gene}${minFlag}${params.min})`;
        }
        if (filter.type === "CellType") {
          let celltypeStr = "";
          params.cellType &&
            params.cellType.forEach((cell, index) => {
              const exculteFlag =
                index > 0 ? (params.notFlag ? "&&" : "||") : "";
              celltypeStr += `${exculteFlag}cell_type${excludeStr}${cell}`;
            });
          filterStr += celltypeStr !== "" ? `&&(${celltypeStr})` : "";
        }
      });

      return filters.length > 0 ? `(${filterStr.slice(2)})` : "";
    },
    /**
     * Apply获取Data Description显示图例
     */
    async fetchAnalysisResult () {
      console.log("analysisiResult");
    },
    /**
     * 获取脑结构图对应的region与subregion，文件 portrait2cellsorting.xlsx
     */
    async fetchXlsxData () {
      if (this.portraitCellsorting.length > 0) {
        return this.portraitCellsorting
      }
      const tmplist = await fetchPortraitXlsx()
      this.$store.commit('cellCollection/PORTRAITCELLSORTING', tmplist)
      return tmplist
    },
    async apply (step2) {
      let filterStr = "";
      let filterNum = 0;
      let portraitFilterStr = ''

      const oldStep = step2 || this.currentStep;
      if (oldStep.stepOrder === 0 && this.sampleType) {
        // 从脑结构图跳转过来的step1
        const portraitCellsorting = await this.fetchXlsxData()
        const sampleType = this.sampleType
        const region = portraitCellsorting.find((val) => val.Portrait.trim() === sampleType).region || ''
        const subregion = portraitCellsorting.find((val) => val.Portrait.trim() === sampleType).subregion || ''

        const regionList = region === '' ? [] : region.split(',')
        const subregionList = subregion === '' ? [] : subregion.split(',')
        let regionStr = '', subregionStr = ''
        if (regionList.length > 0) {
          regionList.forEach((val, index) => {
            regionStr += `${index > 0 ? '||' : ''}region==${val})`
          })
        } else {
          regionStr = ''
        }
        if (subregionList.length > 0) {
          subregionList.forEach((val, index) => {
            subregionStr += `${index > 0 ? '||' : ''}subregion==${val})`
          })
        } else {
          subregionStr = ''
        }
        if (regionStr !== '' && subregionStr !== '') {
          portraitFilterStr = `(${regionStr}||${subregionStr})`
        } else {
          portraitFilterStr = regionStr + subregionStr
        }
        oldStep.filterStr = `(sample_type==Adult)&& (${portraitFilterStr})`
        filterNum = regionList.length + subregionList.length + 1
      } else {
        this.orFilters.forEach((filters, index) => {
          const idxFlag = index > 0 && filters.length > 0 ? "||" : "";
          filterStr += `${idxFlag}${this.commFilters(filters)}`;
          filterNum += filters.length;
          this.currentStep.filterNum = filterNum;
        });
        oldStep.filterStr = filterStr;
      }
      oldStep.filterNum = filterNum;
      const step = Object.assign({}, oldStep);
      if (filterStr.indexOf("||") > -1) {
        filterStr = `(${filterStr})`;
      }
      if (oldStep.stepOrder === 0 && this.sampleType) {
        this.$emit("applyFinish");
        this.$store.state.cellCollection.isApply = true;
        this.$store.commit("cellCollection/CURRENT_STEP", step);
        let stepIdx = this.steps.findIndex((val) => val.stepId == step.stepId);
        stepIdx != -1 && (this.steps[stepIdx] = step);
        this.$store.commit("cellCollection/STEPS", this.steps);
        this.fetchAnalysisResult();
      } else if (filterCheck(step)) {
        if (step.stepOrder > 0) {
          const preStep = this.$store.state.cellCollection.steps[step.stepOrder - 1];
          console.log('preStep==', preStep)
          filterStr += `&&${preStep.filterStr}`;
        }
        step.filterStr = filterStr;
        step.filterNum = filterNum;
        this.$emit("applyFinish");
        this.$store.state.cellCollection.isApply = true;
        this.$store.commit("cellCollection/CURRENT_STEP", step);
        let stepIdx = this.steps.findIndex((val) => val.stepId == step.stepId);
        stepIdx != -1 && (this.steps[stepIdx] = step);
        this.$store.commit("cellCollection/STEPS", this.steps);
        this.fetchAnalysisResult();
      }
    },
    handleFilterClose () {
      if (this.showFilter) {
        this.showFilter = false;
      }
    },
    doFilterSelect (e, index) {
      this.$refs.filterSelect.style.top = e.clientY + "px";
      this.$refs.filterSelect.style.left = e.clientX + "px";
      this.showFilter = true;
      this.currentAddFilterIndex = index;
    },
    filterMenuSelect (menu) {
      this.filterMenu = menu;
    },
    addFilter (filterType) {
      if (
        filterType !== "Gene" &&
        filterType !== "Metadata" &&
        this.orFilters[this.currentAddFilterIndex] &&
        this.orFilters[this.currentAddFilterIndex].filter(
          (e) => e.type === filterType
        ).length > 0
      ) {
        Message({
          message: "You've added it",
          type: "warning",
          offset: 100,
        });
        return;
      }
      this.orFilters[this.currentAddFilterIndex].push({
        type: filterType,
        params: {},
      });
      this.handleFilterClose();
    },
    addOrFilter () {
      if (this.orFilters[this.orFilters.length - 1].length === 0) {
        this.$message({
          message: "You have an empty filter that has not been edited",
          type: "warning",
          duration: 5 * 1000,
          offset: 100,
        });
        return;
      }
      if (this.orFilters.length > 8) {
        this.$message({
          message: "You can only add up to 8 filters",
          type: "warning",
          offset: 100,
        });
        return;
      }
      this.orFilters.push([]);
    },
    filterColse (orFilter, index) {
      orFilter.splice(index, 1);
    },
    closeOrFilter (index) {
      this.orFilters.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./filter-cell-scss.scss";
.filter-wrap {
  .filter-tit {
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
    font-weight: 700;
  }
  .filter-button {
    &-apply {
      padding: 0;
      height: 40px;
      line-height: 40px;
      width: 216px;
      text-align: center;
      font-size: 16px;
    }
  }
  .filter-check-txt {
    color: #828282;
    margin-right: 10px;
  }
  .filter-or-box {
    // border: 1px solid $borderColor;
    border-radius: 12px;
    // padding: 16px;
    margin-top: 20px;
    display: inline-block;
    min-width: 728px;
    .filter-tit {
      color: $themeColor;
    }
  }
  .filter-or-button {
    width: 700px;
    height: 32px;
    line-height: 32px;
    background: rgba(39, 121, 245, 0.25);
    border-radius: 4px;
    border: 2px solid $themeColor;
    text-align: center;
    color: $themeColor;
    margin-top: 20px;
    // margin-left: 16px;
    display: block;
    i {
      font-size: 18px;
      vertical-align: middle;
    }
  }
  .filter-menu {
    position: fixed;
    background: white;
    box-shadow: 0 0 4px #828282;
    border-radius: 4px;
    z-index: 333;
    &-item {
      display: block;
      padding: 6px 0;
      width: 160px;
      text-align: center;
      border-bottom: 1px solid $borderColor;
      cursor: pointer;
      &:hover {
        opacity: 0.9;
        color: rgba($color: $themeColor, $alpha: 1);
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
