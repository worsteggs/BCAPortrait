<template>
  <b-pane label="ATLAS">
    <el-row :getters="20" class="atlas-row">
      <el-col
        class="atlas-item"
        :span="6"
        align="center"
        v-for="item in ATLAS"
        :key="item.name"
        @click.native="chooseAtlas(item.name)"
        :style="{ opacity: item.name === atlasName ? 1 : 0.7 }"
      >
        <img :src="item.img" :alt="item.name" />
        <p>{{ item.name }}</p>
      </el-col>
    </el-row>
  </b-pane>
</template>
<script>
import ATLAS from "@/utils/Atlas.js";
export default {
  data() {
    return {
      ATLAS,
      atlasName: "",
    };
  },
  methods: {
    chooseAtlas(name) {
      this.atlasName = name;
      this.$emit("input", name);
      this.$emit("change", name);
    },
  },
};
</script>
<style lang="scss" scoped>
.atlas-row {
  .atlas-item {
    cursor: pointer;
    opacity: 0.7;
  }
  img {
    width: 130px;
  }
  p {
    font-size: 18px;
    color: $themeColor;
  }
}
</style>
