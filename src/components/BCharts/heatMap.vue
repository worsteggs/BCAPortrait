<template>
  <div :id="cid" :style="{ height, width, 'minHeight': height }"></div>
</template>

<script>
/**
 * 数据格式
 * xAxisData: [x1, x2, x3,...]
 * yAxisData: [y1, y2, y3,...]
 * chartData: [[x, y, data],...]
 */
import extend from 'extend';
export default {
  props: {
    xAxisData: {
      type: Array,
      default: () => [],
    },
    yAxisData: {
      type: Array,
      default: () => [],
    },
    chartData: {
      type: Array,
      default: () => [],
    },
    cid: {
      type: String,
      require: true,
      default: 'chart',
    },
    title: {
      type: String,
      require: true,
      default: 'Cell Type',
    },
    color: {
      type: Array,
      default: () => [
        '#1E5DBC',
        '#4EB2F9',
        '#83C9FC',
        '#1EBCB4',
        '#FBD54E',
        '#FB9F4E',
        '#FF7764',
        '#FF6480',
        '#FF64F9',
        '#ff77a1',
        '#ff6abf',
        '#e96ef5',
        '#826aff',
        '#06b3f9',
        '#0eca81',
        '#51d932',
        '#a0d33c',
        '#d9c122',
      ],
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    width: {
      type: String,
      default: 'auto',
    },
    height: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        if (val && val.length > 0) this.setOptions();
      },
    },
  },
  methods: {
    adjustDomHeight(num) {
      const dom = document.getElementById(this.cid);
      dom.style.height = 12 * num + 'px';
      this.chart.resize();
    },
    setOptions() {
      const { yAxisData, xAxisData, chartData } = this;

      this.adjustDomHeight(yAxisData.length);

      let min = 0,
        max = 0;
      chartData.forEach((rows) => {
        const col = parseFloat(rows[2]);
        if (col < min) min = col;
        if (col > max) max = col;
      });

      min = Math.floor(min * 10) / 10;
      max = Math.ceil(max * 10) / 10;

      let option = {
        tooltip: {
          position: 'top',
          formatter: '{c}',
        },
        toolbox: {
          right: 50,
          itemSize: 25,
          feature: {
            saveAsImage: {
              show: true,
              title: 'Save Image',
              icon: 'image://img/chart_down.png',
              pixelRatio: 5,
            },
          },
        },
        grid: {
          height: yAxisData.length > 50 ? '80%': '70%',
          top: '80px',
          left: '15%',
          width: '70%',
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            width: 10,
            interval: xAxisData.length < 30 ? 0 : 'auto',
            overflow: 'breakAll',
            rotate: xAxisData.length < 30 ? 0 : 90,
            fontSize: xAxisData.length < 30 ? 10 : 8,
          },
        },
        yAxis: {
          type: 'category',
          data: yAxisData,
          axisLabel: {
            interval: 0 , //yAxisData.length < 50 ? 0 : 'auto'
            fontSize: 10,
            formatter: function (name) {
              var strs = name.split(''); //字符串数组
              var str = '';
              for (var i = 0, s; (s = strs[i++]); ) {
                //遍历字符串数组
                str += s;
                if (!(i % 22)) str += '\n'; //按需要求余
              }
              return str;
            },
          },
        },
        visualMap: {
          // type: 'piecewise'
          min,
          max,
          calculable: true,
          // orient: 'horizontal',
          precision: 2,
          right: '5%',
          top: '15%',
        },
        series: [
          {
            type: 'heatmap',
            data: chartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      const parseOption = extend(true, {}, option, this.options);
      this.$nextTick(() => {
        this.chart.setOption(parseOption, true);
      });
    },
    chartRender() {
      const { cid } = this;

      this.chart = echarts.init(document.getElementById(cid));

      if (this.chartData && this.chartData.length > 0) this.setOptions();
    },
  },
  mounted() {
    this.chartRender();
  },
  beforeDestroy() {
    this.chart && this.$echarts.dispose(this.chart);
    this.chart = null;
  },
};
</script>

<style lang='scss'>
.c-char {
  flex: 1;
}
</style>
