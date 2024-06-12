<template>
  <div id="browserTumour" class="iframe-wrap" style="height: calc(100vh)">
    <c-iframe :openUrl="openUrl" cid="dataBrowser" pid="browserTumour" ref="iframe"></c-iframe>
  </div>
</template>
<script>
export default {
  name: "tumourBrowser",
  data () {
    return {
      openUrl: "/Tumour/",
    };
  },
  components: {
    CIframe: () => import("./components/Ciframe.vue"),
  },
};
</script>
<style lang="scss"></style>
