<template>
  <div style="position: relative">
    <div class="down-chart" @click="downloadImg" v-if="chartData.length > 0">
      <img src="/img/chart_down.png" alt="Save Image" />
      <span>Save Image</span>
    </div>
    <div :id="cid"></div>
  </div>
</template>
<script>
import extend from "extend";
import { mapGetters } from "vuex";
import { Chord, G2 } from "@antv/g2plot";
const { registerTheme } = G2;
export default {
  props: {
    cid: {
      type: String,
      default: "container",
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
    },
    chartData: {
      type: Array,
      default: () => [],
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
  },
  data() {
    return {
      chord: null,
    };
  },
  computed: {
    ...mapGetters(["colorsEnum"]),
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.chord.changeData(val); //只更新数据
      },
    },
  },
  mounted() {
    this.$_resizeHandler = () => {
      this.chord.resize();
    };
    window.addEventListener("resize", this.$_resizeHandler);
    this.chordInit();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.$_resizeHandler);
  },
  deactivated(){
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  methods: {
    /**
     * 返回图表的 dataURL 用于生成图片。
     * @param chart 需要获取 DataURL 的 chart 实例
     * @returns 返回图表的 dataURL
     */
    toDataURL(chart) {
      const canvas = chart.chart.getCanvas();
      const renderer = chart.chart.renderer;
      const canvasDom = canvas.get("el");
      let dataURL = "";
      if (renderer === "svg") {
        const clone = canvasDom.cloneNode(true);
        const svgDocType = document.implementation.createDocumentType(
          "svg",
          "-//W3C//DTD SVG 1.1//EN",
          "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"
        );
        const svgDoc = document.implementation.createDocument(
          "http://www.w3.org/2000/svg",
          "svg",
          svgDocType
        );
        svgDoc.replaceChild(clone, svgDoc.documentElement);
        const svgData = new XMLSerializer().serializeToString(svgDoc);
        dataURL =
          "data:image/svg+xml;charset=utf8," + encodeURIComponent(svgData);
      } else if (renderer === "canvas") {
        dataURL = canvasDom.toDataURL("image/png");
      }
      return dataURL;
    },
    /**
     * 图表图片导出
     * @param chart chart 实例
     * @param name 图片名称，可选，默认名为 'G2Chart'
     */
    downloadImg() {
      const chart = this.chord;
      let name = "chordChart";
      const link = document.createElement("a");
      const renderer = chart.renderer;
      const filename = `${name}${renderer === "svg" ? ".svg" : ".png"}`;
      const canvas = chart.chart.getCanvas();
      canvas.get("timeline").stopAllAnimations();

      setTimeout(() => {
        const dataURL = this.toDataURL(chart);
        if (window.Blob && window.URL && renderer !== "svg") {
          const arr = dataURL.split(",");
          const mime = arr[0].match(/:(.*?);/)[1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blobObj = new Blob([u8arr], { type: mime });
          if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blobObj, filename);
          } else {
            link.addEventListener("click", () => {
              link.download = filename;
              link.href = window.URL.createObjectURL(blobObj);
            });
          }
        } else {
          link.addEventListener("click", () => {
            link.download = filename;
            link.href = dataURL;
          });
        }
        const e = document.createEvent("MouseEvents");
        e.initEvent("click", false, false);
        link.dispatchEvent(e);
      }, 16);
    },
    chordInit() {
      const DATA = this.chartData;
      let option = {
        data: DATA,
        sourceField: "source",
        targetField: "target",
        weightField: "value",
        width: this.width || 400,
        height: this.height || 400,
        label: {
          autoRotate: false,
          rotate: 0,
        },
        renderer: "canvas",
        tooltip: {
          fields: ["name", "source", "target", "value", "isNode"],
          showContent: true,
          formatter: (datum) => {
            const { isNode, name, source, target, value } = datum;
            if (isNode) {
              return {
                name: `${name}`, //(源权重)
                value: DATA.filter((d) => d.source === name).reduce(
                  (a, b) => a + b.value,
                  0
                ),
              };
            }
            return {
              name: `${source} -> ${target}`,
              value,
            };
          },
          customItems: (items) => {
            const isNode = items[0].data.isNode; // 是否hover的是节点
            const source = items[0].data.source || "";
            const name = items[0].data.name;
            const color = isNode
              ? this.colorsEnum[name]
              : this.colorsEnum[source];
            items[0].color = color;
            return items;
          },
        },
        nodeStyle: (v) => {
          return {
            fill: this.colorsEnum[v.name],
            stroke: this.colorsEnum[v.name],
          };
        },
        edgeStyle: (v) => {
          return {
            stroke: this.colorsEnum[v.source],
            fillOpacity: 0.5,
            strokeOpacity: 0.5,
          };
        },
      };
      // 将外层传入的option合并后渲染最终效果
      const parseOption = extend(true, {}, option, this.options);
      this.chord = new Chord(this.cid, parseOption);
      DATA.length && this.chord.render();
    },
  },
};
</script>
<style lang="scss" scoped>
.down-chart {
  padding: 10px;
  position: absolute;
  right: 50px;
  top: 0;
  z-index: 22;
  text-align: center;
  color: $themeColor;
  cursor: pointer;
  span {
    display: none;
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    font-size: 12px;
  }
  &:hover {
    span {
      display: block;
    }
  }
}
</style>
