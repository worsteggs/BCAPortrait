<template>
  <div class="wrap">
    <b-pagetitle label="In-data cell sorting" />
    <div class="tips">
      You can use a combination of conditions on both gene expression and metadata to select the subset of brain cells.
      You can add conditions with the ‘<span class="strong">Add a step</span>’ button, analysis the selected data and download them.
    </div>
    <div class="cell-steps">
      <div class="cell-steps-flex">
        <div class="cell-steps-box" :class="{ 'cell-steps-box-actived': true }" @click="selectStep(stepZero)" style="margin-bottom: 20px">
          <span>Step 0</span>
          <div>
            All cells in uGT: <i>{{ stepZero.cellNum }}</i>
          </div>
        </div>
        <div class="cell-steps-box" v-for="(step, index) in steps" :key="index" :class="{
            'cell-steps-box-actived': step.stepOrder <= currentStep.stepOrder,
          }" @click="selectStep(step)">
          <div class="icon-del" v-if="index > 0">
            <i @click.stop="dodel(step)" class="el-icon-delete"></i>
          </div>

          <span>Step {{ index + 1 }}</span>
          <!-- <div v-if="index == 0">All cells in uGT:<i>1093299</i></div> -->
          <div>
            Filter Applied :
            <i>{{ step.filterNum == -1 ? "None" : step.filterNum }}</i>
            <br />Cell Number :
            <i>{{ step.cellNum == -1 ? "None" : step.cellNum }}</i>
          </div>
        </div>
      </div>
      <div class="cell-steps-box cell-steps-add" @click="addStep">
        <i class="el-icon-circle-plus"></i>
        <p>Add a step</p>
      </div>
    </div>
    <div>
      <Filters ref="filters" v-show="currentStep.stepId != -1" @applyFinish="applyFinish" />
      <DataDesc ref="data_desc" @analysis="doAnalysis" />
      <CellAnalysis ref="analysis_data" />
    </div>
  </div>
</template>
<script>
import Filters from "./components/Filters.vue";
import DataDesc from "./components/DataDesc";
import CellAnalysis from "./components/CellAnalysis";
import { Message } from "element-ui";
import { portraitSampleType } from "./components/portrait2cellsortingUtil.js";
export default {
  name: "cellSorting",
  provide () {
    return {
      cellsort: this,
    };
  },
  components: {
    Filters,
    DataDesc,
    CellAnalysis,
  },
  data () {
    return {
      actived: -1,
      stepZero: {
        status: 1,
        stepId: -1,
        cellNum: 0,
      },
    };
  },
  created () {
    if (this.steps.length <= 0) {
      this.selectStep(this.stepZero);
    }
    // this.$root.$on("saveSteps", () => {
    //   this.saveSteps();
    // });
  },
  activated () {
    this.$store.commit("cellCollection/STEPS", [])  // 重置steps
    if (portraitSampleType(this)) { // 从脑结构图跳转过来，作为第一步
      this.addStep()
      this.$refs.filters.apply()
    } else {
      this.steps.length == 1 && this.dodel(this.steps[0])
    }
  },

  computed: {
    steps () {
      return this.$store.state.cellCollection.steps;
    },
    analysisResult () {
      return this.$store.state.cellCollection.analysisResult;
    },
    currentStep () {
      return this.$store.state.cellCollection.currentStep;
    },
    queryLang () {
      return `Selected ${this.currentStep.cellNumber} cells \r\nSelect condition: \r\n${this.currentStep.queryLang}`;
    },
  },
  methods: {
    async dodel (step) {
      // this.steps.splice(
      //   this.steps.indexOf((e) => e.stepId === step.stepId),
      //   1
      // );
      let steps = this.steps;
      steps.splice(this.steps.indexOf((e) => e.stepId === step.stepId), 1)
      this.$store.commit("cellCollection/STEPS", steps)
      if (this.steps.length > 0) {
        console.log('dodel=========', this.steps[steps.length - 1])
        this.selectStep(steps[steps.length - 1]);
      }
    },
    addStep () {
      if (this.steps.length > 0) {
        const lastStep = this.steps[this.steps.length - 1];
        console.log("last step ", lastStep);
        if (
          lastStep.filters.length === 0 ||
          (lastStep.filters.length === 1 && lastStep.filters[0].length === 0 && lastStep.filterStr === "")
        ) {
          Message({
            message: `Step${lastStep.stepOrder + 1} had no filter`,
            type: "warning",
            offset: 100,
          });
          return;
        }
      }
      const preStep = this.steps[this.steps.length - 1];
      const newStep = {
        filterNum: -1,
        cellNum: -1,
        filters: [[]],
        stepId: "S" + new Date().getTime(),
        filterStr: "",
        stepOrder: this.steps.length,
        parentStepId: preStep ? preStep.stepId : null,
      };
      if (this.steps.length > 0 && preStep.status !== 1) {
        this.$root.$emit("applyStep", preStep);
      }
      this.steps.push(newStep);
      newStep.collectId = preStep
        ? preStep.collectId
        : "C" + this.steps[0].stepId;
      this.selectStep(newStep);
    },
    async saveSteps () {
      // 不需要登录
      if (
        this.steps.length <= 0 ||
        !this.steps[0].filters ||
        this.steps[0].filters.length <= 0 ||
        !this.steps[0].filters[0] ||
        this.steps[0].filters[0].length <= 0
      ) {
        Message({
          message: `No filter found, Cannot save`,
          type: "warning",
          offset: 100,
        });
        return;
      }
      const collectId = this.steps[0].collectId;
      if (this.$store.getters.unLogin) {
        localCollect.putCollect(collectId);
      } else {
        const stepList = this.steps.map((e) => {
          return { stepId: e.stepId };
        });
        // await saveSteps({ collectId, stepList })
      }

      Message({
        message: `Steps saved successfully`,
        type: "success",
        offset: 100,
      });
    },
    selectStep (step) {
      console.log('selectStep=========', step)
      console.log('===selectStep222 allSteps=========', this.steps)
      this.$store.commit("cellCollection/CURRENT_STEP", step);
    },
    applyFinish () {
      this.$refs.analysis_data.resetGene();
      this.$refs.analysis_data.visible = false;
    },
    doAnalysis (step) {
      this.$refs.analysis_data.initAnalysis(step);
    },
  },
};
</script>
<style lang="scss" scoped>
.tips {
  margin: -35px 0 30px 0;
  padding: 0 30px 0 10px;
  .strong {
    font-size: 16px;
    font-weight: bold;
  }
}
.cell-steps {
  display: flex;
  @include wrapPadding;
  &-flex {
    max-width: calc(100% - 200px);
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    height: 120px;
    display: flex;
    align-items: flex-start;
  }
  &-box {
    position: relative;
    width: 200px;
    height: 75px;
    border-radius: 20px;
    display: inline-block;
    flex-direction: column;
    justify-content: space-around;
    color: #323233;
    border: 2px solid white;
    padding: 16px 24px;
    background: white;
    margin-right: 20px;
    cursor: pointer;
    span {
      color: $themeColor;
      font-size: 18px;
    }
    i {
      font-style: normal;
      color: $themeColor;
      font-weight: bold;
    }
    .icon-del {
      font-size: 20px;
      position: absolute;
      right: 10px;
      top: 0;
    }
  }
  &-box-actived {
    border-color: $themeColor;
  }
  &-add {
    color: $themeColor;
    text-align: center;
    display: flex;
    align-items: center;
    i {
      font-size: 24px;
    }
  }
}
</style>
