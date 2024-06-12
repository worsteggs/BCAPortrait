<template>
  <div class="c-mark-down markdown-body">
    <VueMarkdown v-if="data" :source="data" v-highlight></VueMarkdown>
  </div>
</template>
<script>
import hljs from 'highlight.js' // 导入代码高亮文件
// import 'highlight.js/styles/a11y-dark.css' // 导入代码高亮样式
import 'highlight.js/styles/github.css'  //导入代码高亮样式
import VueMarkdown from 'vue-markdown'
export default{
  props:{
    data: {
      type: String,
      default: ''
    },
  },
  components:{
    VueMarkdown
  },
  data(){
    return{
      mdData:this.data
    }
  },
  directives:{
    highlight: function(el){
      const blocks = el.querySelectorAll('pre code')
      blocks.forEach(block => {
        hljs.highlightBlock(block)
      })
    }
  }
}
</script>
