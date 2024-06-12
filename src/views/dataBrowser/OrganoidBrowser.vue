<template>
  <div id="browserOrganoid" class="iframe-wrap" style="height: calc(100vh)">
    <c-iframe :openUrl="openUrl" cid="dataBrowser" pid="browserOrganoid" ref="iframe"></c-iframe>
  </div>
</template>
<script>
export default {
  name: "organoidBrowser",
  data () {
    return {
      openUrl: "/Organoid/",
    };
  },
  components: {
    CIframe: () => import("./components/Ciframe.vue"),
  },
};
</script>
<style lang="scss"></style>
