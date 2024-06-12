<template>
  <div class="c-char" :id="cid" :style="{ height: height, width: width }" />
</template>
<script>
import extend from "extend";
import { mapGetters } from "vuex";
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
      default: () => [],
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "380px",
    },
    needErrorLine: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chart: "",
    };
  },
  computed: {
    ...mapGetters(["colorsEnum"]),
  },
  watch: {
    chartData: {
      handler(val) {
        const color = this.setColor();
        const {
          data = [],
          xAxis: xData = [],
          markLineData = [],
          max = null,
        } = this.constructOption();
        this.chart.setOption({
          xAxis: [
            {
              data: xData,
            },
          ],
          yAxis: [
            {
              max,
            },
          ],
          series: [
            {
              data,
              itemStyle: {
                color: function (params) {
                  return color[params.dataIndex];
                },
              },
              markLine: {
                data: markLineData,
              },
            },
          ],
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.$_resizeHandler = () => {
      this.chart.resize();
    };
    window.addEventListener("resize", this.$_resizeHandler);
    this.chartRender();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.$_resizeHandler);
  },
  deactivated() {
    window.removeEventListener("resize", this.$_resizeHandler);
  },
  methods: {
    setColor() {
      const _c = [
        "#1E5DBC",
        "#4EB2F9",
        "#83C9FC",
        "#1EBCB4",
        "#FBD54E",
        "#FB9F4E",
        "#FF7764",
        "#FF6480",
        "#FF64F9",
      ];
      const color = [];
      const colorsEnum = this.colorsEnum || [];
      this.chartData.forEach((item, i) => {
        const colorHex =
          this.color.length > 0
            ? this.color[i % this.color.length]
            : colorsEnum[item.name] || _c[i % _c.length];
        color.push(colorHex);
      });
      return color.length ? color : _c;
    },
    constructOption() {
      // 构建数据
      const lineData = this.chartData || [];
      let data = [],
        xAxis = [],
        markLineData = [],
        max = "";
      lineData.forEach((item, i) => {
        xAxis.push(item.name);
        data.push(item.value);
        if (this.needErrorLine) {
          const markLineItem = [
            {
              coord: [i, item.lower],
            },
            {
              coord: [i, item.upper],
            },
          ];
          markLineData.push(markLineItem);
        }
        // 解决y轴最大刻度刚好为某个upper 导致的 误差线不显示问题
        if (item.upper && item.upper > max) {
          max = item.upper;
        }
      });
      return {
        data,
        xAxis,
        max,
        markLineData,
      };
    },
    chartRender() {
      const color = this.setColor();
      const id = this.cid;
      const {
        data = [],
        xAxis: xData = [],
        markLineData = [],
        max = null,
      } = this.constructOption();
      this.chart = this.$echarts.init(document.getElementById(id));
      let option = {
        tooltip: {
          show: true,
          backgroundColor: "rgba(51, 51, 51, 0.9)",
          borderWidth: 0,
          textStyle: {
            color: "#fff",
          },
          formatter: (params = {}) => {
            const {
              data = "",
              name = "",
              componentType: type = "",
              dataIndex: index,
            } = params;
            const upper = this.chartData[index]
              ? this.chartData[index].upper
              : "";
            const lower = this.chartData[index]
              ? this.chartData[index].lower
              : "";
            let tipHtml = "";
            if (type === "series") {
              tipHtml = `<div style="margin:0 5px"><div>${name}:&nbsp;${data}</div><div/>`;
            } else if (type === "markLine") {
              tipHtml = `<div style="margin:0 5px">
              <div>upper:&nbsp;${upper}</div>
              <div>lower:&nbsp;${lower}</div>
              </div>`;
            }
            return tipHtml;
          },
        },
        toolbox: {
          right: 50,
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
          left: "12%",
        },
        xAxis: [
          {
            type: "category",
            color: "#59588D",
            data: xData,
            axisPointer: {
              type: "line",
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              margin: 15,
              color: "#828282",
              fontSize: 14,
              rotate: 10,
            },
          },
        ],
        yAxis: [
          {
            max,
            axisLabel: {
              color: "#828282",
              padding: [0, 20, 0, 0],
              fontSize: 14,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: "#F1F1F5",
              },
            },
          },
        ],
        series: [
          {
            type: "bar",
            data,
            barWidth: "12px",
            label: {
              show: false,
            },
            itemStyle: {
              color: function (params) {
                return color[params.dataIndex];
              },
              borderRadius: [30, 30, 0, 0],
            },
            markLine: {
              symbol: "rect",
              symbolSize: [5, 1],
              lineStyle: {
                color: "#828282",
                type: "solid",
              },
              data: markLineData,
            },
          },
        ],
      };
      // 将外层传入的option合并后渲染最终效果
      const parseOption = extend(true, {}, option, this.options);
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(parseOption);
    },
  },
};
</script>
