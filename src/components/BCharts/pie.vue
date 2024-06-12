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
    title: {
      type: String,
      require: true,
      default: "Cell Type",
    },
    color: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default () {
        return {};
      },
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
  },
  data () {
    return {
      chart: "",
    };
  },
  computed: {
    ...mapGetters(["colorsEnum"]),
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
        // 使用JSON.stringify与JSON.parse进行简单粗暴的深拷贝，避免污染源数组字段
        const data = JSON.parse(JSON.stringify(val)) || [];
        const color = this.setColor();
        data.forEach((item, i) => {
          if (item.value) {
            // 修复数据为0的情况 不设置边框样式
            item.itemStyle = {
              borderWidth: 10,
              borderColor: color[i],
            };
            item.emphasis = {
              // 高亮状态
              itemStyle: {
                borderWidth: 10,
                borderRadius: 10,
              },
            };
          }
        });
        this.chart.setOption({
          series: [
            {
              color,
              data,
            },
          ],
        });
      },
    },
  },
  mounted () {
    this.$_resizeHandler = () => {
      this.chart.resize();
    };
    window.addEventListener("resize", this.$_resizeHandler);
    this.chartRender();
  },
  beforeDestroy () {
    window.removeEventListener("resize", this.$_resizeHandler);
  },
  deactivated () {
    window.removeEventListener("resize", this.$_resizeHandler);
  },
  methods: {
    setColor () {
      const color = [];
      const defaultColor = [
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
      const colorsEnum = this.colorsEnum || [];
      const colorLen = this.color.length || defaultColor.length
      this.chartData.forEach((item, i) => {
        // NOTE:最后一次循环 取余尽时 首尾颜色相同的情况 末尾下标值加1取颜色 
        const index = (i === this.chartData.length - 1 && i % colorLen === 0) ? (i % colorLen) + 1 : i % colorLen
        const colorHex = this.color[index] || colorsEnum[item.name] || defaultColor[index];
        color.push(colorHex);
      });
      return color;
    },
    chartRender () {
      // 使用JSON.stringify与JSON.parse进行简单粗暴的深拷贝，避免污染源数组字段
      const data = JSON.parse(JSON.stringify(this.chartData));
      const color = this.setColor();
      data.forEach((item, i) => {
        if (item.value) {
          // 修复数据为0的情况 不设置边框样式
          item.itemStyle = {
            borderWidth: 10,
            borderRadius: 10,
            borderColor: color[i],
          };
          item.emphasis = {
            // 高亮状态
            itemStyle: {
              borderWidth: 10,
              borderRadius: 10,
            },
          };
        }
      });
      const id = this.cid;
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
              data: { name = "", value = "" },
            } = params;
            return `<div style="margin:0 5px">${name}&nbsp;(${value})<div/>`;
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
        legend: {
          show: true,
          itemWidth: 12,
          itemHeight: 12,
          width: "50%",
          height: 300,
          icon: "circle",
          orient: "vertical",
          top: "center",
          left: "60%",
          type: "scroll",
          textStyle: {
            // width:80,
            lineHeight: 20,
            overflow: "breakAll",
          },
        },
        series: [
          {
            name: "饼图",
            type: "pie",
            width: "50%",
            center: ["50%", "50%"],
            radius: ["79%", "80%"],
            minAngle: 2, //设置扇形的最小占比
            color,
            label: {
              show: true,
              position: "center",
              fontSize: 18,
              fontWeight: "bold",
              formatter: () => {
                return this.title;
              },
            },
            data,
          },
        ],
      };
      // 将外层传入的option合并后渲染最终效果
      const parseOption = extend(true, {}, option, this.options);
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(parseOption);
      this.chart.on('finished', function () {
        console.log('finished---------')

      })
    },
  },
};
</script>
<style lang="scss">
.c-char {
  flex: 1;
}
</style>
