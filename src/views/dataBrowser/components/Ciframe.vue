<template>
  <iframe :src="openUrl" :id="cid" class="analsis-iframe" scrolling="no" frameborder="0" ref="iframe" @load="iframeload"></iframe>
</template>
<script>
import { Loading } from "element-ui";
export default {
  props: {
    openUrl: {
      type: String,
      default: "/AdultBrain",
    },
    cid: {
      type: String,
      default: "cIframe",
    },
    pid: {
      type: String,
      default: "iframeWrap",
    },
  },
  data () {
    return {
      iframeHeight: "calc(100vh)",
      loading: null,
    };
  },
  watch: {
    openUrl: {
      handler (url) {
        this.loading = Loading.service({
          lock: true,
          text: "Loading...",
          fullscreen: true,
        });
      },
      immediate: true,
    },
  },
  methods: {
    iframeload () {
      try {
        const cIframe = document.getElementById(this.cid);
        let aWindow = cIframe.contentWindow;
        let aWindowHeight =
          aWindow.document.documentElement.scrollHeight ||
          aWindow.document.body.scrollHeight;
        let doc = cIframe.contentDocument || cIframe.document;
        let cHeight = Math.max(
          doc.body.clientHeight,
          doc.documentElement.clientHeight
        );
        let sHeight = Math.max(
          doc.body.scrollHeight,
          doc.documentElement.scrollHeight
        );
        let lheight = Math.max(cHeight, sHeight);
        let finalHeight = Math.max(lheight, aWindowHeight);
        this.iframeHeight = finalHeight + "px";
        this.loading.close();
        cIframe.style.height = finalHeight + "px";
        this.$nextTick(() => {
          document.getElementById(this.pid).style.height =
            finalHeight + 100 + "px";
        });
      } catch (e) {
        this.loading.close();
        //跨域获取不到
        throw new Error("自定义错误setIframeHeight Error", e);
      }
      this.loading.close();
    },
  },
};
</script>
<style lang="scss">
.iframe-wrap {
  // padding-top: 20px;
  // margin-bottom: -48px;
  flex: inherit;
}
.analsis-iframe {
  min-width: 100%;
  min-height: 100%;
}
</style>
