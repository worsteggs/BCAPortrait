<template>
  <div>
    <AnatomyBrain :atlasName="atlasName" />
    <div style="height: 30px"></div>
  </div>
</template>
<script>
export default {
  name: "index",
  components: {
    AnatomyBrain: () => import("./components/AnatomyBrain.vue"),
  },
  data() {
    return {
      atlasName: "Adult Brain",
    };
  },
  methods: {
    changeAtlas(item) {
      console.log(item);
      this.atlasName = item;
      this.component = "AnatomyBrain";
    },
  },
};
</script>
