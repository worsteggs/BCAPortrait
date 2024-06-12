<template>
  <div id="browserFetal" class="iframe-wrap" style="height: calc(100vh)">
    <c-iframe :openUrl="openUrl" cid="dataBrowser" pid="browserFetal" ref="iframe"></c-iframe>
  </div>
</template>
<script>
export default {
  name: "fetaltBrowser",
  data () {
    return {
      openUrl: "/FetalBrain/",
    };
  },
  components: {
    CIframe: () => import("./components/Ciframe.vue"),
  },
};
</script>
<style lang="scss"></style>
