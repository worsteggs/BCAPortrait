<template>
<div class="c-char" :id="cid" :style="{height:height,width:width}"></div>
</template>
<script>
import extend from 'extend'
export default{
  props:{
    cid:{
      type:String,
      require: true,
      default: 'chart'
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    color:{
      type: Array,
      default: () => ['#1E5DBC','#4EB2F9','#83C9FC','#1EBCB4','#FBD54E','#FB9F4E','#FF7764','#FF6480','#FF64F9']
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    linksData:{
      type: Array,
      default: () => []
    },
    categorieData:{
      type: Array,
      default: () => []
    },
    chartData: {
      type: Array,
      default: () => []
    },
  },
  data(){
    return{
      chart:''
    }
  },
  computed:{
    graphData(){
      const { chartData = [], linksData = [], categorieData = [] } = this
      return{
        chartData,
        linksData,
        categorieData
      }
    }
  },
  watch:{
    graphData:{
      handler(val) {
        const { chartData = [] , linksData = [], categorieData = []  } = val || {}
        this.chart.setOption({
          series: [{
            data:chartData,
            links:linksData,
            categories:categorieData,
          }]
        })
      },
      deep: true
    }
  },
  mounted() {
    this.$_resizeHandler = () =>{
      this.chart.resize()
    }
    window.addEventListener('resize', this.$_resizeHandler)
    this.chartRender()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  deactivated(){
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  methods:{
    chartRender(){
      const data = this.chartData
      const links = this.linksData
      const categories = this.categorieData
      const color = this.color
      const id = this.cid
      this.chart = this.$echarts.init(document.getElementById(id))
      let option = {
        tooltip:{
          backgroundColor:'rgba(51, 51, 51, 0.9)',
          borderWidth:0,
          textStyle:{
            color:'#fff'
          },
          formatter:(params) =>{
            const {dataType, marker, name, value, data = {}} =  params || {}
            if(dataType === 'node'){
              return `${marker}&nbsp;${data.name}：${data.value || ''}`
            }else if(dataType === 'edge'){
              const idToNameObj = {}
              this.chartData.forEach((item,i) => {
                idToNameObj[item.id] = item.name 
              })
              return `${idToNameObj[data.source]} > ${idToNameObj[data.target]}`
            }
          }
        },
        toolbox:{
          right:50,
          itemSize:25,
          feature:{
            saveAsImage:{
              show:true,
              title: 'Save Image',
              icon:'image://img/chart_down.png',
              pixelRatio: 5
            }
          }
        },
        color,
        grid:{
          top:'5%',
          bottom:'5%'
        },
        legend: {
          show:true,
          icon:'circle',
          orient: 'vertical',
          itemWidth: 12,
          itemHeight: 12,
          width:'50%',
          // height:150,
          icon:'circle',
          orient: 'vertical',
          top: "center",
          right: '20%',
          textStyle:{
            width:80,
            lineHeight:20,
            overflow:'breakAll'
          }
        },
        series: [
          {
            // name: 'graph chart',
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: 1000,
              // 边的两个节点之间的距离，这个距离也会受 repulsion。
              // 支持设置成数组表达边长的范围，此时不同大小的值会线性映射到不同的长度。值越小则长度越长
              edgeLength: [100, 300],
              // layoutAnimation:false
            },
            data,
            links,
            categories,
            roam: true,
            label: {
              show: true,
              position: 'top',
              formatter: '{b}',
            },
            labelLayout: {
              hideOverlap: false, // 是否隐藏重叠的标签
            },
            lineStyle: {
              color: 'source',
              curveness: 0,
            },
          },
        ],
      }
      // 将外层传入的option合并后渲染最终效果
      const parseOption = extend(true,{},option,this.options)
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(parseOption)
    }
  }
}
</script>
