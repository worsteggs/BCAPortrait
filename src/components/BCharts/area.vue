<template>
<div class="c-char" :id="cid" :style="{height:chartHeight,width:width}" />
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
      default: ''
    },
    xAxisData:{
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
      chart:'',
      chartHeight:'', // 整体山脊图的高度
      singleHeight:25, // 单个山脊图的高度
    }
  },
  watch: {
    chartData: {
      handler(val) {
        this.changeData()
      },
      deep: true
    }
  },
  created(){
    // 根据数据个数和单个山脊图的高度计算整体需要的高度 +2 是为了 底部能流出较多的空间给 最后一个模拟刻度尺显示
    this.chartHeight = (this.chartData.length + 2) * this.singleHeight + 'px'
    this.$nextTick(()=>{
      this.chartRender()
    })
  },
  mounted() {
    this.$_resizeHandler = () =>{
      this.chart.resize()
    }
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  deactivated(){
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  methods:{
    constructOption(){
      // 构造适合该山脊图的参数模式
      const dataArr = this.chartData
      const length = dataArr.length
      let height = this.singleHeight
      let data = [] // 折线图数据
      let xData = [] // x轴数据 可不用展示
      let toolTipData = [] // tooltip展示数据
      let longestName = ''

      dataArr.forEach((item,i) =>{
        const keyArr = Object.keys(item) // 键名数组
        let keyValArr = [] // 键对应的值的二元数组
        let xDataArr = [] // x轴名称的二元数组
        keyArr.forEach((val,j) =>{
          if(val.includes('X')){
            keyValArr.push(item[val])
            xDataArr.push(val)
          }
        })
        data.push(keyValArr)
        xData.push(xDataArr)
        // 获取名称长度最长的细胞名字
        longestName = item._row.length>longestName.length?item._row:longestName

        toolTipData.push({
          name:item._row,
          median:item.nz_median,
          ratio:item.nz_ratio
        })
      })
      let xAxisArr = []
      let yAxisArr = []
      let seriesArr = []
      let gridArr = []
      dataArr.forEach((item,i) =>{
        // 构造x轴数据和样式
          xAxisArr.push({
            gridIndex: i,
            type: 'category',
            boundaryGap: false,
            data: xData[i],
            axisLabel: {
                show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
                show: false
            },
            name: (item.nz_ratio*100).toFixed(2) +'%',
            nameLocation: 'end',
            nameTextStyle:{
              align:'left'
            }
        })
        // 构造y轴数据和样式
        yAxisArr.push({
            gridIndex: i,
            axisLabel: {
                show: true,
                // 上方grid设置的containLabel:true 决定的是包括了坐标轴标签在内的所有内容所形成的矩形的位置
                // 这常用于『防止标签溢出』的场景
                color:'transparent',
                formatter:function(){
                  // 该label不显示 只用于渲染合适的图表大小,去name最长的显示
                  return longestName
                }
            },
            axisLine: {
              show: true,
              lineStyle: {
              color: '#828282'
              }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            splitArea: {
              show: false,
            },
            name: `${toolTipData[i].name}`,
            nameLocation: 'start',
            nameTextStyle:{
              align:'right',
              padding: [0, 8, 8, 0],
              verticalAlign:'bottom'
            }
        })
        // 构造布局结构
        gridArr.push({
            top: i*height,
            height: height,
            left:'3%',
            right:'16%',
            containLabel:true
        })
        // 构造series数据
        seriesArr.push({
            type: 'line',
            data: data[i],
            xAxisIndex: i,
            yAxisIndex: i,
            smooth: true,
            symbol: 'none',
            lineStyle:{
                color:'#828282'
            },
            areaStyle: {
                color:new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                  offset: 0,
                  color: '#ff9a5a' // 0% 处的颜色
                }, {
                    offset: 0.5,
                    color: '#ff6e2c' // 100% 处的颜色
                    },{
                    offset: 1,
                    color: '#ff2a29' // 100% 处的颜色
                }
              ]),
            }
        })
      })

      // 构造最后一个用于刻度尺
      const tickMax = dataArr.length ? dataArr[0].x_max : 0
      const tickNum = Math.floor(tickMax/0.5)
      let tickXData = []
      for (var i=0; i<=tickNum; i++){
        tickXData.push(i*0.5)
      }
      if(tickXData.length){
        tickMax > tickXData.slice(-1) && tickXData.push(tickMax)
      }
      var tickData = [0,0]
      xAxisArr.push({
          gridIndex: length, // 最后一个是用于显示标记刻度的，且与前一个有距离
          type: 'category',
          boundaryGap: false,
          data: tickXData,
          axisTick:{
            lineStyle:{
                color:"#000"
            }
          },
          axisLine:{
              show:true,
              lineStyle:{
                  color:new echarts.graphic.LinearGradient(0, 1, 1, 0, [{
                    offset: 0,
                    color: '#f4ff5f' // 0% 处的颜色
                }, {
                    offset: 0.5,
                    color: '#ff9944' // 100% 处的颜色
                }, {
                    offset: 1,
                    color: '#ff2a29' // 100% 处的颜色
                }
                ]),
                width:4
              }
          }
      })
      yAxisArr.push({
          gridIndex: length,
          axisLabel: {
              show: true,
              color:'transparent',
              formatter:function(){
                return longestName
              }
          },
          axisLine: {
              show: true,
              lineStyle: {
              color: '#828282'
              }
          },
          axisTick: {
              show: false
          },
          splitLine: {
              show: false
          },
          splitArea: {
            show: false,
        }
      })
      gridArr.push({
          top: length*height,
          height: height + 10,
          left:'3%',
          right:'16%',
          containLabel:true
      })
      seriesArr.push( {
          type: 'line',
          data: tickData,
          xAxisIndex: length,
          yAxisIndex: length,
          smooth: true,
          symbol: 'none',
          lineStyle:{
            color:'transparent'  
          },
          areaStyle: {
              color:new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: '#ff9a5a' // 0% 处的颜色
              }, {
                  offset: 0.5,
                  color: '#ff6e2c' // 100% 处的颜色
                  },{
                  offset: 1,
                  color: '#ff2a29' // 100% 处的颜色
              }
            ]),
          }
      })
      return{
        toolTipData,
        xAxisArr,
        yAxisArr,
        gridArr,
        seriesArr
      }
    },
    chartRender(){
      const { toolTipData, xAxisArr, yAxisArr, gridArr, seriesArr } = this.constructOption()

      const id = this.cid
      this.chart = this.$echarts.init(document.getElementById(id))
      
      if(!this.chartData.length) return

      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { //去掉移动的指示线
            type: 'none'
          },
          backgroundColor:'rgba(51, 51, 51, 0.9)',
          borderWidth:0,
          textStyle:{
            color:'#fff'
          },
          formatter:function(parmas){
            const index = parmas[0].seriesIndex
            const name = toolTipData[index] ? toolTipData[index].name : ''
            const median = toolTipData[index] ? toolTipData[index].median : ''
            const ratio = toolTipData[index] ? toolTipData[index].ratio : ''
            return `<div style="font-size:12px"><div>Cell Type Name：${name}</div><div>None-zero Median：${median}</div><div>None-zero Ratio：${ratio}</div></div>`
          }
        },
        toolbox:{
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
        xAxis: xAxisArr,
        yAxis: yAxisArr,
        grid: gridArr,
        series: seriesArr
      }
      // 将外层传入的option合并后渲染最终效果
      const parseOption = extend(true,{},option,this.options)
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(parseOption)
    },
    changeData(){
      const { toolTipData, xAxisArr, yAxisArr, gridArr, seriesArr } = this.constructOption()
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { //去掉移动的指示线
            type: 'none'
          },
          backgroundColor:'rgba(51, 51, 51, 0.9)',
          borderWidth:0,
          textStyle:{
            color:'#fff'
          },
          formatter:function(parmas){
            const index = parmas[0].seriesIndex
            const name = toolTipData[index] ? toolTipData[index].name : ''
            const median = toolTipData[index] ? toolTipData[index].median : ''
            const ratio = toolTipData[index] ? toolTipData[index].ratio : ''
            return `<div style="font-size:12px"><div>Cell Type Name：${name}</div><div>None-zero Median：${median}</div><div>None-zero Ratio：${ratio}</div></div>`
          }
        },
        toolbox:{
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
        xAxis: xAxisArr,
        yAxis: yAxisArr,
        grid: gridArr,
        series: seriesArr
      }
      // 将外层传入的option合并后渲染最终效果
      const parseOption = extend(true,{},option,this.options)
      // 先清除所有option 避免一直报xAxis and yAxis must use the same grid
      // 使用刚指定的配置项和数据显示图表。配置true清空原先的option
      this.chart.setOption(parseOption,true)
      // 重新设置高度
      this.chartHeight = (this.chartData.length + 2) * this.singleHeight + 'px'
      this.chart.resize({height: this.chartHeight})
    }
  }
}
</script>
