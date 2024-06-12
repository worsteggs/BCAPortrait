<template>
  <div style="position: relative; text-align: right">
    <el-checkbox class="select-all" :style="checkboxStyle" v-model="selectAllLabel" @change="selectChange">select all</el-checkbox>
    <div :id="cid" :style="{ height, width }"></div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
/**
 * 数据格式
 * chartData: [[x, y, data],...]
 */

let chart = null;
import extend from "extend";

export default {
  props: {
    cid: {
      type: String,
      require: true,
      default: "chart",
    },
    title: {
      type: String,
      require: true,
      default: "Cell Type",
    },
    color: {
      type: Array,
      default: () => [
        "#1E5DBC",
        "#4EB2F9",
        "#83C9FC",
        "#1EBCB4",
        "#FBD54E",
        "#FB9F4E",
        "#FF7764",
        "#FF6480",
        "#FF64F9",
        "#ff77a1",
        "#ff6abf",
        "#e96ef5",
        "#826aff",
        "#06b3f9",
        "#0eca81",
        "#51d932",
        "#a0d33c",
        "#d9c122",
      ],
    },
    options: {
      type: Object,
      default () {
        return {};
      },
    },
    width: {
      type: String,
      default: "auto",
    },
    height: {
      type: String,
      default: "",
    },
    chartData: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    return {
      selectAllLabel: true,
      checkboxStyle: { transform: `translateX(${this.width})` },
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
        if (val && Object.keys(val).length > 0)
          this.setOptions(Object.freeze(val));
      },
    },
  },
  computed: {
    ...mapGetters(["colorsEnum"]),
  },
  methods: {
    selectChange (val) {
      if (chart) {
        chart.dispatchAction({
          type: val ? "legendAllSelect" : "legendInverseSelect",
        });
      }
    },
    bindEvent (chart) {
      const self = this;
      chart.off("legendselectchanged");
      chart.on("legendselectchanged", function ({ selected }) {
        const noSelectAll = Object.keys(selected).some((el) => !selected[el]);
        self.selectAllLabel = !noSelectAll;
      });
    },
    getChart () {
      return chart;
    },
    setColor (mount, index) {
      const unit = 360 / mount;
      const half = Math.ceil(mount / 2) - 1;
      let i = 1;
      if (index > half) {
        i = (index - half) * 2;
      } else {
        i = index * 2 + 1;
      }
      const h = Math.floor(unit * i);
      const l = 100 - Math.floor((h % 30) / 5) * 10;
      const s = 100 - Math.floor(((h % 30) + 20) / 5) * 6;
      return `hsl(${h}deg ${l}% ${s}%)`;
    },
    setCheckboxPos (text) {
      const span = document.createElement("span");
      span.style.fontSize = "12px";
      span.style.visibility = "none";
      span.innerHTML = text;
      document.body.append(span);
      const checkboxX = span.offsetWidth - 53;
      this.checkboxStyle = { transform: `translateX(-${checkboxX}px)` };
      span.remove();
    },
    setOptions (chartData) {
      let len = 0,
        symbolSize = 1,
        legendtext = "";
      Object.keys(chartData).forEach((k, i) => {
        legendtext = k.length > legendtext.length ? k : legendtext;
        const index = [...chartData[k]].reverse().findIndex((el) => el !== 0);
        len += (chartData[k].length - index) / 2;
      });
      this.setCheckboxPos(legendtext);
      if (len < 1e3) {
        symbolSize = 4;
      } else if (len < 1e4) {
        symbolSize = 3;
      } else if (len < 5 * 1e5) {
        symbolSize = 2;
      }
      const series = [];
      const mount = Object.keys(chartData).length;
      Object.keys(chartData).forEach((k, i) => {
        series.push({
          type: "scatter",
          data: chartData[k],
          name: k,
          dimensions: ["x", "y"],
          symbolSize,
          itemStyle: {
            color: this.setColor(mount, i),
            opacity: 0.4,
          },
          animation: false,
          large: true,
          largeThreshold: 7500, // NOTE:绘制优化的阈值 默认为2000
          // progressive: 4000,
          // progressiveThreshold: 7500,
        });
      });
      let option = {
        backgroundColor: "#FFFFFF",
        tooltip: {
          trigger: "item",
          formatter: "{a} : <br/>{c}",
        },
        toolbox: {
          top: "15",
          left: "10%",
          itemSize: 25,
          feature: {
            saveAsImage: {
              show: true,
              title: "Save Image",
              icon: "image://img/chart_down.png",
              pixelRatio: 5,
            },
          },
        },
        grid: {
          right: 300,
          bottom: 70,
          left: 70,
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          // orient: "horizontal",
          right: 0,
          top: 0,
          bottom: 0,
          textStyle: {
            width: 200,
            lineHeight: 20,
            overflow: "breakAll",
          },
        },
        xAxis: [
          {
            scalse: false,
            axisLabel: {
              color: "#ccc",
              fontSize: 14,
            },
            splitLine: null,
          },
        ],
        yAxis: [
          {
            scalse: false,
            axisLabel: {
              color: "#ccc",
              fontSize: 14,
            },
            splitLine: null,
          },
        ],
        dataZoom: [
          {
            type: "inside",
          },
          {
            type: "slider",
            showDataShadow: false,
          },
          {
            type: "inside",
            orient: "vertical",
          },
          {
            type: "slider",
            orient: "vertical",
            showDataShadow: false,
            left: "0",
          },
        ],
        animation: false,
        series,
      };
      const parseOption = extend(true, {}, option, this.options);
      chart.setOption(parseOption, true);
      this.selectAllLabel = true;
    },
    chartRender (chartData) {
      const { cid } = this;
      chart = this.$echarts.init(document.getElementById(cid));
      this.bindEvent(chart);
      if (chartData && Object.keys(chartData).length > 0)
        this.setOptions(Object.freeze(chartData));
    },
    appendData (seriesIndex, data) {
      chart.appendData({
        seriesIndex,
        data,
      });
    },
    resizeHandler () {
      chart && chart.resize();
    },
  },
  mounted () {
    this.chartRender();
  },
  beforeDestroy () {
    chart && this.$echarts.dispose(chart);
    chart = null;
  },
};
</script>
<style lang="scss" scoped>
.select-all {
  transform: translateX(-128px);
}
</style>
