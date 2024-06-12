<template>
  <div id="browserWrap" class="iframe-wrap" style="height: calc(100vh)">
    <c-iframe :openUrl="openUrl" cid="dataBrowser" pid="browserWrap" ref="iframe"></c-iframe>
  </div>
</template>
<script>
export default {
  name: "adultBrowser",
  data () {
    return {
      openUrl: "https://singlecell.broadinstitute.org/single_cell/study/SCP2476/bca-tumor?#study-visualize",
    };
  },
  components: {
    CIframe: () => import("./components/Ciframe.vue"),
  },
};
</script>
<style lang="scss"></style>
