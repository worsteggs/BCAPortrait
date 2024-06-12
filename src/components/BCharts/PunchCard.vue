<template>
  <div>
    <div
      v-if="data.length > 0"
      :id="cid"
      class="c-chart"
      :style="{ height: height, width: width }"
    />
    <el-empty :description="noDataMsg"></el-empty>
  </div>
</template>
<script>
import extend from "extend";
export default {
  props: {
    cid: {
      type: String,
      require: true,
      default: "chart",
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    color: {
      type: Array,
      default: () => [
        "#2381b3",
        "#6090a9",
        "#85a09e",
        "#a3b092",
        "#bec086",
        "#d7d177",
        "#efe366",
      ],
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "380px",
    },
    chartData: {
      type: Array,
      default: () => [],
    },
    xAxis: {
      type: Array,
      default: () => [],
    },
    yAxis: {
      type: Array,
      default: () => [],
    },
    noDataMsg: {
      type: String,
      default: "No Data!",
    },
  },
  data() {
    return {
      data: [],
    };
  },
  created() {
    this.chart = "";
    this.stackBingo = [];
  },
  mounted() {
    this.chart && this.chart.dispose();
    const vm = this;
    this.$_resizeHandler = () => {
      vm.chart && vm.chart.resize();
    };
    window.addEventListener("resize", this.$_resizeHandler);
    // this.chartRender()
  },
  activated() {
    window.addEventListener("resize", this.$_resizeHandler);
    this.chart && this.chart.resize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.$_resizeHandler);
    this.chart && this.$echarts.dispose(this.chart);
    this.chart = null;
  },
  deactivated() {
    window.removeEventListener("resize", this.$_resizeHandler);
    // this.chart && this.$echarts.dispose(this.chart)
    // this.chart = null
  },
  methods: {
    initChart(data, finalData) {
      const id = this.cid;
      if (this.chart) {
        this.chart.resize();
      }
      this.chart =
        this.chart || this.$echarts.init(document.getElementById(id));
      let xAxis = [
        ...new Set(
          data.map((val) => {
            return val.x;
          })
        ),
      ];
      let yAxis = [
        0,
        ...new Set(
          data.map((val) => {
            return val.y;
          })
        ),
      ];
      const xAxisData = [],
        yAxisData = [];
      xAxis.forEach((value) => {
        xAxisData.push({
          value,
          textStyle: {
            fontSize: 14,
          },
        });
      });
      yAxis.forEach((value) => {
        yAxisData.push({
          value,
          textStyle: {
            fontSize: 14,
          },
        });
      });
      const option = {
        tooltip: {
          position: "top",
          formatter: function (params) {
            return `
            <b class="tooltip-b">x</b> : ${params.value[0]}<br/>
            <b class="tooltip-b">y</b> : ${params.value[1]}<br/>
            <b class="tooltip-b">percent</b> : ${params.value[2]}%<br/>
            <b class="tooltip-b">avg</b> : ${params.value[3]}
            `;
          },
          textStyle: {
            width: 100,
            fontSize: 14,
          },
        },
        grid: {
          left: 10,
          bottom: 10,
          right: 0,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          nameLocation: "center",
          data: xAxisData,
          boundaryGap: true,
          splitLine: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#202020",
            },
          },
          axisLabel: {
            interval: 0,
            rotate: 60,
          },
          axisTick: {
            length: 2,
          },
        },
        yAxis: {
          type: "category",
          data: yAxisData,
          boundaryGap: false,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#202020",
            },
          },
        },
        series: [
          {
            name: "Punch Card",
            type: "scatter",
            symbolSize: function (val) {
              // return val[2] > 10 ? (val[2] + scale) / 2 : val[2] * 2
              const _val = parseFloat(val[2]);
              if (_val <= 10) return 10;
              if (10 < _val && _val <= 20) return 20;
              else if (20 < _val && _val <= 30) return 25;
              else if (30 < _val && _val <= 40) return 30;
              else if (40 < _val && _val <= 50) return 35;
              else if (50 < _val) return 40;
            },
            data: finalData,
            itemStyle: {
              color: (val) => {
                // console.log('节点颜色显示的信息：',val)
                const d = val.data[3] * 100; //当前值的AVG*100
                const dRvg = Math.round(d) % this.color.length;
                return this.color[dRvg];
              },
              borderWidth: 1,
              borderColor: "#000000",
            },
            animationDelay: function (idx) {
              return idx * 5;
            },
          },
        ],
      };
      // 将外层传入的option合并后渲染最终效果
      const parseOption = extend(true, {}, option, this.options);
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(parseOption, true);
    },
    chartRender(data) {
      // avg：节点颜色；percent：节点大小（值）
      let finalData = [];
      data.forEach((item) => {
        finalData.push([item.x, item.y, item.percent, item.avg]);
      });
      this.data = finalData;
      setTimeout(() => {
        finalData.length && this.initChart(data, finalData);
      }, 400);
    },
  },
};
</script>
<style>
.tooltip-b {
  font-size: 16px;
}
</style>
