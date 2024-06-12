<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  // async mounted() {
  //   await this.$store.dispatch("app/fetchColor", {
  //     fileName: "csv/colors.csv",
  //   });
  // },
};
</script>
<style lang="scss">
#app {
  // background: #f5f9fe;
  min-height: 100vh;
}
</style>
