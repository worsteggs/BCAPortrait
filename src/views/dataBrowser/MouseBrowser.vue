<template>
  <div id="browserMouse" class="iframe-wrap" style="height: calc(100vh)">
    <c-iframe :openUrl="openUrl" cid="dataBrowser" pid="browserMouse" ref="iframe"></c-iframe>
  </div>
</template>
<script>
export default {
  name: "mouseBrowser",
  data () {
    return {
      openUrl: "/MouseBrain/",
    };
  },
  components: {
    CIframe: () => import("./components/Ciframe.vue"),
  },
};
</script>
<style lang="scss"></style>
