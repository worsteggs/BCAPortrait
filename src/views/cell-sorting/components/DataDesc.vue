<template>
  <b-pane class="desc-wrap" label="Data Description">
    <el-alert style="margin-bottom: 10px" v-if="processErrorText" :title="'processing failed:' + processErrorText + ',Please try again'" type="error" show-icon />
    <div class="description-chart">
      <div class="desc-chart">
        <pie-chart cid="pieSorting1" :chartData="regionData" title="Anatomical region" v-if="regionData.length > 0" :color="colors"></pie-chart>
        <el-empty v-else description="Selected None cells" />
      </div>
      <div class="desc-chart desc-chart-divider">
        <pie-chart cid="pieSorting2" :chartData="cellTypeData" title="Cell Type" v-if="cellTypeData.length > 0" :color="colors"></pie-chart>
        <el-empty v-else description="Selected None cells" />
      </div>
    </div>
    <div class="desc-button desc-chart" v-if="currentStep.stepId != -1">
      <div style="flex: 1">
        <div class="desc-button-query">
          <div class="tit">cell query language</div>
          <div class="con">
            <textarea id="copyFont" v-model="queryLang" name="desc" placeholder="queryLang string" class="layui-textarea" readonly="readonly" />
          </div>
        </div>
      </div>

      <div style="flex: 1; padding-left: 40px">
        <b-button class="desc-button-analysis" @click="analysisData">
          <img src="@/assets/img/analysis.png" alt="" width="18" />
          Analysis
        </b-button>
        <b-button @click="downloadFn" :loading="downloadBtnLoading" :disabled="currentStep.cellNum>(50*10000)">
          <img src="@/assets/img/download.png" alt="" width="18" />
          Download data
        </b-button>
      </div>
    </div>
  </b-pane>
</template>
<script>
import pieChart from "@/components/BCharts/pie.vue";
import { sorting } from "@/api/cellsorting.js";
import { Loading } from "element-ui";
export default {
  props: {},
  components: { pieChart },
  computed: {
    steps () {
      return this.$store.state.cellCollection.steps;
    },
    currentStep () {
      return this.$store.state.cellCollection.currentStep;
    },
    queryLang () {
      return `Selected ${this.currentStep.cellNum === -1 ? "None" : this.currentStep.cellNum
        } cells \r\nSelect condition: \r\n${this.currentStep.filterStr}`;
    },
  },
  data () {
    return {
      regionData: [],
      cellTypeData: [],
      descData: [],
      downloadDEList: [],
      colors: [
        "#1E5DBC",
        "#4EB2F9",
        "#83C9FC",
        "#1EBCB4",
        "#FBD54E",
        "#FB9F4E",
        "#FF7764",
        "#FF6480",
        "#FF64F9",
      ],
      processErrorText: null,
      downloadBtnLoading: false
    };
  },
  watch: {
    currentStep () {
      if (
        (this.currentStep.filterStr == "" || !this.currentStep.filterStr) &&
        this.currentStep.stepId !== -1
      ) {
        this.resetData();
      } else {
        this.sortingRing();
      }
    },
  },
  mounted () {
    this.sortingRing()
  },
  methods: {
    resetData () {
      this.regionData = [];
      this.cellTypeData = [];
    },
    analysisData () {
      if (this.currentStep.filterStr == "" || !this.currentStep.filterStr) {
        return;
      }
      this.$emit("analysis", { stepId: this.currentStep.stepId });
    },
    async sortingRing () {
      if (
        (this.currentStep.filterStr == "" || !this.currentStep.filterStr) &&
        (this.currentStep.stepId !== -1 && this.currentStep.stepOrder === 0)
      ) {
        return;
      }
      const loading = Loading.service({
        lock: true,
        text: "Searching...",
        fullscreen: true
      });
      try {
        let params = {
          conditions: this.currentStep.filterStr,
          // conditions: "cell_type==Neuron",
          columns: ["cell_type", "region"],
          charts: [
            {
              name: "Region",
              type: "ring",
              groupBy: "region",
            },
            {
              name: "Cell Type",
              type: "ring",
              groupBy: "cell_type",
            },
          ],
        };
        let result = null;
        const hadResult = this.$store.state.cellCollection.applyResult;
        const isApply = this.$store.state.cellCollection.isApply;
        const hadResultIdx = hadResult.findIndex((val) => val.stepId == this.currentStep.stepId)
        if (hadResultIdx > -1 && !isApply) {
          result = hadResult[hadResultIdx].result
        } else {
          result = await sorting(params);
        }

        if (result.ret == false) {
          this.processErrorText = result.msg;
          this.currentStep.cellNum = -1;
          this.regionData = [];
          this.cellTypeData = [];
          this.descData = [];
          loading.close();
          return;
        }
        this.processErrorText = null;
        this.regionData = result.find((val) => val.name == "Region").items;
        this.cellTypeData = result.find((val) => val.name == "Cell Type").items;
        this.descData = [...this.regionData, ...this.cellTypeData];
        this.$store.commit("cellCollection/APPLY_RESULT", { result, stepId: this.currentStep.stepId, stepOrder: this.currentStep.stepOrder });
        this.$store.state.cellCollection.isApply = false;
        // this.descData = descData.map((val) => {
        //   return { name: val.name, value: val.value };
        // });
        // 只需要其中一个计算sum
        let sum = this.regionData.map((val) => {
          return val.value;
        });
        this.currentStep.cellNum =
          sum.length > 0 ? sum.reduce((n, m) => n + m) : 0; //细胞总数
        let stepIdx = this.steps.findIndex(
          (val) => val.stepId == this.currentStep.stepId
        );
        stepIdx != -1 && (this.steps[stepIdx] = this.currentStep);
        this.$store.commit("cellCollection/STEPS", this.steps);
        this.currentStep.errorMsg = null;
        loading.close();
      } catch (error) {
        // this.currentStep.errorMsg = error;
        this.regionData = [];
        this.cellTypeData = [];
        this.descData = [];
        loading.close();
      }
    },
    async downloadFn () {
      if (
        (this.currentStep.filterStr == "" || !this.currentStep.filterStr) &&
        this.currentStep.stepId !== -1
      ) {
        return;
      }
      if (this.currentStep.cellNum > (50 * 10000)) {
        // 超过50万不让下载
        return;
      }
      if (this.downloadBtnLoading) return;
      const loading = Loading.service({
        lock: true,
        text: "Download...",
        fullscreen: true
      });
      try {
        let params = {
          down: true,
          conditions: this.currentStep.filterStr,
          // conditions: "cell_type==Neuron",
          columns: ["cell_type", "region"],
          charts: [
            {
              name: "Region",
              type: "ring",
              groupBy: "region",
            },
            {
              name: "Cell Type",
              type: "ring",
              groupBy: "cell_type",
            },
          ],
        };
        this.downloadBtnLoading = true;
        const timeout = 2 * 60 * 1000 //默认的超时时间为2分钟
        const result = await sorting(params, timeout);
        if (result.ret === false) {
          this.processErrorText = result.msg;
          this.currentStep.cellNum = -1;
          this.downloadBtnLoading = false;
          loading.close();
          return;
        }
        // 下载数据
        // http://heart.ifr.fidt.top:61010
        // this.downFile(result, 'uniBRAIN.csv')
        this.downFile(result, 'uniBRAIN.data')  //对应下载zip文件
        // 下载工具
        setTimeout(() => {
          this.downFile('/export/readme.zip', 'uniBRAIN_readme.zip')
        }, 100)
        // console.log('111111', this.downloadDEList)
        this.processErrorText = null;
        this.currentStep.errorMsg = null;
        this.downloadBtnLoading = false;
        loading.close();
      } catch (error) {
        this.descData = [];
        this.downloadBtnLoading = false;
        loading.close();
      }
    },
    downFile (url, name) {
      console.log(url, 'url=====')
      const link = document.createElement('a')
      //_blank表示在新窗口打开链接
      // link.target = '_blank'
      /* 使用a直接下载 csv文件
      var csvContent = "data:text/csv;charset=utf-8,\uFEFF" + url;
       link.href = encodeURI(csvContent);
       */
      link.href = url
      link.setAttribute('download', name) // 下载文件的名称及文件类型后缀
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
    }
    // fileSave(file){
    //   const filename = `file.csv`
    //   const blob = new Blob([file])
    //   const url = window.URL.createObjectURL(blob)
    //   const downloadLink = document.createElement('a')
    //   downloadLink.href = url
    //   downloadLink.download = filename
    //   document.body.appendChild(downloadLink)
    //   downloadLink.click()
    //   document.body.removeChild(downloadLink)
    //   window.URL.revokeObjectURL(url);
    // }
  },
};
</script>
<style lang="scss" scoped>
@import "./filter-cell-scss.scss";

.desc-wrap {
  .description-chart {
    display: flex;
    justify-content: space-between;
    .desc-chart {
      flex: 1;
      &-divider {
        border-left: 1px solid $borderColor;
        padding-left: 40px;
      }
    }
  }
  .desc-button {
    display: flex;
    align-items: center;
    margin-top: 20px;
    &-query {
      flex: 1;
      border: 1px solid #f3f4f6;
      border-radius: 6px;
      padding: 10px;
      .tit {
        line-height: 30px;
        font-size: 18px;
        font-weight: 700;
        margin: 0 8px;
      }
      textarea {
        display: block;
        width: 100%;
        padding: 0 8px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        border: none;
        font-size: 14px;
        line-height: 20px;
        color: #697786;
        height: 80px;
      }
    }
    &-analysis {
      background: #4eb2f9;
    }
    img {
      vertical-align: middle;
      margin-right: 4px;
    }
  }
}
</style>
