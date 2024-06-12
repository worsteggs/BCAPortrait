<template>
  <el-row class="atlas-list" :gutter="110">
    <el-col class="atlas-col" v-for="item in ATLAS" :key="item.label" @click.native="changeAtlas(item)">
      <brain-img-wrap :style="cellGenestyle()" :isGene="isGene" :geneActive="cellClassName(item.name)" ref="brainImgWrap">
        <img :src="item.img" alt="" />
      </brain-img-wrap>
      <span>{{ item.label }}</span>
    </el-col>
  </el-row>
</template>
<script>
import ATLAS from "@/utils/Atlas.js";
export default {
  name: "atlasBrains",
  props: {
    isGene: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cellClassName () {
      return (name) => {
        return this.atlasName == name;
      };
    },
    cellGenestyle () {
      return (resizeWidth = "180px") => {
        let _w = resizeWidth,
          _W = "100%";
        return { height: this.isGene ? _w : _W, width: this.isGene ? _w : _W };
      };
    },
  },
  data () {
    return {
      ATLAS,
      atlasName: "Adult Brain",
    };
  },
  mounted () {
    window.onresize = () => {
      let _w = "180px";
      const _clientWidth = document.body.clientWidth;
      if (_clientWidth < 768) {
        _w = "150px";
      } else {
        _w = "100%";
      }
      // this.cellGenestyle(_w);
      this.$refs.brainImgWrap.forEach((item) => {
        item.$el.style.height = _w;
        item.$el.style.width = _w;
      });
    };
  },
  methods: {
    changeAtlas (item) {
      console.log(item);
      this.atlasName = item.name;
      this.$emit("input", item.name);
      this.$emit("change", item);
    },
  },
};
</script>
<style lang="scss" scoped>
.atlas-list {
  .el-col {
    text-align: center;
    margin-bottom: 10px;
    width: 20%;
    span {
      display: block;
      margin: 0 auto;
      color: #23255f;
      font-size: 18px;
      font-weight: 550;
      margin-top: 20px;
    }
    img {
      transition: all 0.3s;
    }
    &:hover {
      cursor: pointer;
      img {
        transform: scale(1.06);
      }
    }
  }
}
@media only screen and (max-width: 1200px) {
  .atlas-list .el-col {
    width: 25%;
  }
}
@media only screen and (max-width: 992px) {
  .atlas-list .el-col {
    width: 33%;
  }
}
@media only screen and (max-width: 768px) {
  .atlas-list .el-col {
    width: 50%;
  }
}
</style>
