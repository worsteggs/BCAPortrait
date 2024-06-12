<template>
  <b-pane label="Expression Distribution Explorer" v-if="visible">
    <el-alert style="margin-top: 10px" v-if="processErrorText" :title="'processing failed:' + processErrorText + ',Please try again'" type="error" show-icon />
    <p slot="desc">Expression Distribution Explorer</p>
    <!-- <div class="analysis-chart"></div> -->
    <div class="umap-scatter">
      <div class="mt16">
        Color by
        <el-select v-model="colorBy" placeholder="please select">
          <el-option label="Cell Type" value="cell_type" />
          <el-option label="Donor" value="donor_ID" />
          <el-option label="Gene" value="gene" />
          <el-option label="Seq Tech" value="seq_tech" />
          <el-option label="Study" value="reference" />
        </el-select>
        <span v-if="colorBy == 'gene'" class="ml16">
          Gene
          <el-select v-model="gene" filterable placeholder="Filter by name" :filter-method="
              (val) => fetchGenes({ value: val, optionName: 'options' })
            " :loading="loading">
            <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </span>
        <span class="ml16">
          x-axis
          <el-select v-model="params.x" style="width: 160px" filterable placeholder="Filter by name" :filter-method="
              (val) => fetchGenes({ value: val, optionName: 'xOptions' })
            " :loading="loading">
            <el-option v-for="item in xOptions" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </span>
        <span class="ml16">
          y-axis
          <el-select v-model="params.y" style="width: 160px" filterable placeholder="Filter by name" :filter-method="
              (val) => fetchGenes({ value: val, optionName: 'yOptions' })
            " :loading="loading">
            <el-option v-for="item in yOptions" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </span>
      </div>
      <div style="position: relative" class="loading-scatter" v-loading="!chartDataLoaded">
        <Scatter ref="scatter_Sorting1" cid="scatterSorting1" :chartData="chartData" width="900px" height="600px" class="x-scatter xx-scatter" />
      </div>
    </div>
    <div class="area-box">
      <div class="left-area">
        <b class="sub-title">Gene expressions across cell types<img @click="violinDown('gene1')" src="/img/chart_down.png" alt="Save Image" /></b>
        <!-- <a class="chart_down" @click="violinDown('violinBox1')" /> -->
        <div>
          <el-select v-model="gene1" style="width: 160px" filterable placeholder="Filter by name" :filter-method="
              (val) => fetchGenes({ value: val, optionName: 'geneOptions1' })
            " :loading="loading">
            <el-option v-for="item in geneOptions1" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
          <el-alert style="margin-top:10px;margin-bottom: 10px" v-if="processErrorText1" :title="'processing failed:' + processErrorText1 + ',Please try again'" type="error" show-icon />
          <div v-if="gene1Data" class="violinBox" id="gene1"></div>
          <el-empty v-else description="Not available in current version of uniBRAIN" />
        </div>
      </div>
      <div class="right-area">
        <b class="sub-title">Gene expressions across regions<img @click="violinDown('gene2')" src="/img/chart_down.png" alt="Save Image" /></b>
        <div>
          <el-select v-model="gene2" style="width: 160px" filterable placeholder="Filter by name" :filter-method="
              (val) => fetchGenes({ value: val, optionName: 'geneOptions2' })
            " :loading="loading">
            <el-option v-for="item in geneOptions2" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
          <el-alert style="margin-top:10px;margin-bottom: 10px" v-if="processErrorText2" :title="'processing failed:' + processErrorText2 + ',Please try again'" type="error" show-icon />
          <div v-if="gene2Data" class="violinBox" id="gene2"></div>
          <el-empty v-else description="Not available in current version of uniBRAIN" />
        </div>
      </div>
    </div>
    <!-- <b-button>Save image</b-button> -->
  </b-pane>
</template>
<script>
import { Loading } from "element-ui";
import Scatter from "@/components/BCharts/scatter22.vue";
import { postCSV, getFileBin } from "@/api/system.js";
import { sorting } from "@/api/cellsorting.js";
import { saveToFile } from '@/utils/html2canvas'
import violin from '@/utils/violin2ridge'
export default {
  components: {
    Scatter,
  },
  data () {
    return {
      visible: false,
      rightVisible: false,
      scatterVisible: false,
      loadingFunc: null,
      cellType: {
        extra: {
          related: [],
          adjacent: [],
        },
      },
      cellType: [],
      colorBy: "cell_type",
      // gene: "ACTB",
      chartData: {},
      chartDataLoaded: false,
      options: [],
      xOptions: [],
      yOptions: [],
      params: {
        x: "ACTB",
        y: "B2M",
      },
      loading: false,
      processErrorText: null,
      geneOptions1: [], // 左侧基因下拉
      gene1: "ACTB", // 左侧山脊图下拉绑定
      gene1Data: {}, // 左侧山脊图数据
      processErrorText1: '', // 左侧山脊图报错提示
      geneOptions2: [], // 右侧基因下拉
      gene2: "ACTB", // 右侧山脊图下拉绑定
      gene2Data: {}, // 右侧山脊图数据
      processErrorText2: '', // 右侧山脊图报错提示
    };
  },
  created () {
    // this.chartData = {};
    this.setTimer = null;
  },
  computed: {
    isGeneColorBy () {
      return this.colorBy.indexOf("_gene") > -1;
    },
    currentStep () {
      return this.$store.state.cellCollection.currentStep;
    },
    updateParam () {
      return {
        colorBy: this.colorBy,
        x: this.params.x,
        y: this.params.y,
        gene: this.gene,
      };
    },
  },
  watch: {
    currentStep (val) {
      if (val.stepId == -1) {
        this.visible = false;
        this.rightVisible = false;
        this.scatterVisible = false;
      }
      if (
        (this.currentStep.filterStr == "" || !this.currentStep.filterStr) &&
        this.currentStep.stepId !== -1
      ) {
        this.visible = false;
        this.rightVisible = false;
        this.scatterVisible = false;
        this.chartData = {};
      } else {
        this.visible && this.fetchArea()
        this.rightVisible && this.fetchAreaRight()
        this.scatterVisible && this.fetchScatter();
      }
    },
    colorBy: {
      handler (val) {
        if (val === "gene") {
          this.gene = "ACTB";
          this.fetchGenes({ value: "A", optionName: "options" });
        } else {
          this.gene = "";
        }
        val !== "" && this.fetchScatter();
      },
      immediate: true,
    },
    gene (val) {
      val !== "" && this.fetchScatter();
    },
    gene1 (val) {
      val !== "" && this.fetchArea();
    },
    gene2 (val) {
      val !== "" && this.fetchAreaRight();
    },
    params: {
      handler () {
        this.fetchScatter();
      },
      immediate: true,
      deep: true,
    },
  },
  async mounted () {
    // this.fetchGenes({ value: "A", optionName: "xOptions" });
    // this.fetchGenes({ value: "A", optionName: "yOptions" });
    // this.fetchGenes({ value: "A", optionName: "geneOptions1" });
    // this.fetchGenes({ value: "A", optionName: "geneOptions2" });
    this.fetchGenes({ value: "A" });
  },
  destroyed () {
    this.fetchProgress && clearInterval(this.fetchProgress);
  },
  methods: {
    resetGene () {
      // 重置变量
    },
    // 获取基因下拉数据
    async fetchGenes ({ value = "", optionName = null }) {
      // value为请求的值，optionName为赋值的变量名
      this.loading = true;
      try {
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
          maxLength: 50,
        });
        if (!optionName) {
          // 默认情况下，界面中有四个地方需要赋值gene的options
          this.xOptions = this.yOptions = this.geneOptions1 = this.geneOptions2 = result.x.map((val) => {
            return { value: val, name: val };
          });
        } else {
          this[optionName] = result.x.map((val) => {
            return { value: val, name: val };
          });
        }

        this.loading = false;
      } catch (error) {
        if (!optionName) {
          this.xOptions = this.yOptions = this.geneOptions1 = this.geneOptions2 = []
        } else {
          this[optionName] = [];
        }

        this.loading = false;
      }
    },
    endOfAreaAndArearight () {
      // 左右山脊图数据返回成功后（报错情况也算），返回true进行请求散点图
      const processErrorText1 = this.processErrorText1 !== '' || this.processErrorText1
      const processErrorText2 = this.processErrorText2 !== '' || this.processErrorText2
      return (this.gene2Data.length > 0 || processErrorText2) && (this.gene1Data.length > 0 || processErrorText1) && this.visible
    },
    initAnalysis () {
      if (this.currentStep.filterStr == "" || !this.currentStep.filterStr) {
        return;
      }
      // this.fetchScatter();
      this.visible = false;
      this.gene1Data = this.gene2Data = []
      this.fetchArea()
      this.fetchAreaRight()
      this.setTimer = setInterval(() => {
        if (this.endOfAreaAndArearight()) {

          clearInterval(this.setTimer);
          this.fetchScatter();
        }
      }, 500)
    },

    fetchBin (result) {
      const _chartData = {};

      const cells = Object.keys(result);

      /**事先声明 _chartData key值，避免因为请求速度不同，导致每次渲染的图表颜色不同 */
      cells.forEach((cell) => {
        _chartData[cell] = null;
      });
      const AMOUNT = 5; //队列长度
      const LEN = cells.length; //总长度
      const queue = []; //保存请求队列

      for (let m = 0; m < Math.ceil(LEN / AMOUNT); m++) {
        let _cell = cells.slice(AMOUNT * m, AMOUNT * (m + 1));
        queue.push(_cell);
      }

      let downloadIndex = 0;
      return new Promise((resolve, reject) => {
        queue.forEach(async (qe) => {
          for (let i = 0; i < qe.length; i++) {
            let key = qe[i];

            // let rawData = await getFileBin(result[key]);
            _chartData[key] = new Float32Array(result[key]);
            downloadIndex++;
          }
          if (downloadIndex === LEN) {
            //全部下载完毕后，进行下一步
            resolve(_chartData);
          }
        });
        resolve(_chartData);
      });
    },
    // 获取左侧山脊图(小提琴格式)数据
    async fetchArea () {
      if (this.currentStep.filterStr == "" || !this.currentStep.filterStr) {
        return;
      }
      this.visible = true;
      const loading = Loading.service({
        lock: true,
        text: "Searching...",
        // fullscreen: true,
        target: ".left-area",
      });
      try {
        const params = {
          conditions: this.currentStep.filterStr,
          columns: ['cell_type', this.gene1],
          charts: [
            {
              type: 'violin',
              x: this.gene1,
              groupBy: 'cell_type'
            },
          ],
        };
        this.processErrorText1 = null
        const result = await sorting(params)
        this.gene1Data = result && result.length ? result : ''
        if (result.ret == false) {
          this.processErrorText1 = result.msg;
          // this.currentStep.cellNum = -1; //不影响currentStep的cellNum
          this.gene1Data = '';
          loading.close();
          return;
        }
        if (!this.gene1Data) return
        violin(result[0].json, 'gene1', this.gene1, 'cell_type', null)
        loading.close();
        this.rightVisible = true; // 请求右侧图表
      } catch (err) {
        console.log(err, 'erererr')
        this.gene1Data = ''
        loading.close();
        clearInterval(this.setTimer);
      }
    },
    // 获取右侧山脊图(小提琴格式)数据
    async fetchAreaRight () {
      if (this.currentStep.filterStr == "" || !this.currentStep.filterStr) {
        return;
      }
      // this.visible = true;
      const loading = Loading.service({
        lock: true,
        text: "Searching...",
        // fullscreen: true,
        target: ".right-area",
      });
      try {
        const params = {
          conditions: this.currentStep.filterStr,
          columns: ['region', this.gene2],
          charts: [
            {
              type: 'violin',
              x: this.gene2,
              groupBy: 'region'
            },
          ],
        };
        this.processErrorText2 = null
        const result = await sorting(params)
        this.gene2Data = result && result.length ? result : ''
        if (result.ret == false) {
          this.processErrorText2 = result.msg;
          // this.currentStep.cellNum = -1; //不影响currentStep的cellNum
          this.gene2Data = '';
          loading.close();
          return;
        }
        if (!this.gene2Data) return
        violin(result[0].json, 'gene2', this.gene2, 'organ', null)
        loading.close();
        this.scatterVisible = true; // 请求散点图
      } catch (err) {
        this.gene2Data = ''
        loading.close();
        clearInterval(this.setTimer);
      }
    },
    violinDown (id) {
      if (!this.downing) {
        this.downing = true
        saveToFile(document.getElementById(id), null, () => {
          this.downing = false
        })
      }
    },
    async fetchScatter () {
      if (this.currentStep.filterStr == "" || !this.currentStep.filterStr) {
        return;
      }
      // this.visible = true;
      const loading = Loading.service({
        lock: true,
        text: "Searching...",
        target: ".loading-scatter",
      });
      try {
        /***
         * 一次性加载数据
         */
        let groupBy = this.colorBy;
        if (groupBy == "gene") {
          groupBy = this.gene;
        }
        let params = {
          conditions: this.currentStep.filterStr,
          // conditions: "cell_type==Neuron",
          columns: [...new Set([groupBy, this.params.x, this.params.y])],
          charts: [
            {
              name: "Expression Distribution Explorer",
              type: "scatter",
              groupBy,
              x: this.params.x,
              y: this.params.y,
            },
          ],
        };
        const result = await sorting(params);
        if (result.ret == false) {
          this.processErrorText = result.msg;
          this.chartData = {};
          loading.close();
          return;
        }
        this.processErrorText = null;
        const _chartData = await this.fetchBin(result[0].items);

        /* 将数组转成 Float32Array 格式， 渲染变快了，至于为啥会变快，还不知道*/
        // Object.keys(_chartData).forEach((key) => {
        //   const len =
        //     _chartData[key].length > 1e5 ? _chartData[key].length : 1e5;
        //   let arr = new Float32Array(len);
        //   arr.set(_chartData[key]);
        //   _chartData[key] = arr;
        // });
        this.chartData = _chartData;
        this.chartDataLoaded = true;
        loading.close();
      } catch (error) {
        this.chartData = {};
        loading.close();
        clearInterval(this.setTimer);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.analysis-chart {
  height: 200px;
}
.umap-scatter {
  padding: 40px 30px;
}
.x-scatter {
  width: 900px;
  height: 600px;
  margin: 16px auto 0;
}

.selectall {
  position: absolute;
  right: 270px;
  top: 0%;
  font-size: 14px;
  margin-top: -30px;
}
.area-box {
  display: flex;
  margin-top: 30px;
  .violinBox {
    margin-top: 20px;
  }
  .left-area {
    flex: 1;
    margin: 0 10px;
  }
  .right-area {
    flex: 1;
    margin: 0 10px;
  }
  .sub-title {
    color: #192633;
    font-size: 16px;
    display: inline-block;
    padding-bottom: 10px;
    img {
      margin-left: 10px;
      cursor: pointer;
      border-radius: 50%;
      &:hover {
        background: #c5e4fa;
      }
    }
  }
}
</style>
<!-- <style lang="scss">
.xx-scatter {
  .select-all {
    left: -139px;
    // left: auto;
    // right: 82px;
  }
}
</style> -->
