<template>
  <div class="wrap">
    <b-pane label="Anatomical Portrait of the Adult Brain">
      <p slot="desc">Interactive viewer of the adult brain regions in BrainCellAtlas.</p>
      <div class="brainarea">
        <!-- <div> -->
        <div style="position:absolute;top:0;left:0;bottom:0;right:0;z-index:0" @click="handleOutsideClick"></div>
        <brainArea @brainAreaUpdate="(value) => (careBrain = value)" ref="brain_area" />
        <!-- </div> -->

        <div v-if="careBrain!=''&&careBrain!==null">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item @click.native="$emit('toLast')" style="font-size:18px">
              {{ atlasName }}
            </el-breadcrumb-item>
            <el-breadcrumb-item style="font-size:16px">{{ careBrain }}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix">
              <b>{{ careBrain }}</b>
              <el-button style="float: right; padding: 3px 0" type="text" @click="toWiki">
                Read more in Wikipedia
              </el-button>
            </div>
            <span class="text item" style="min-height:200px">
              {{ BrainDetails[careBrain]&&BrainDetails[careBrain].detail||'.' }}
            </span>
          </el-card>
        </div>
      </div>
      <!-- <div v-else style="height: 200px"></div> -->
      <!-- <p>
        {{ `Checkout ${atlasName} in` }}
        <router-link :to="`/dataBrowser/${atlasName.split(' ')[0]}`">
          <el-button type="text"> Data viewer </el-button>
        </router-link>
      </p> -->
    </b-pane>
  </div>
</template>
<script>
import brainArea from "./brainArea.vue";
import { BrainDetails } from './brainDetails.js';
export default {
  name: "Anatomy",
  components: { brainArea },
  props: {
    atlasName: {
      type: String,
      default: "Adult Brain",
    },
  },
  data () {
    return {
      careBrain: "",
      BRAIN_STRUCTURE: new Map(),
      BrainDetails
    };
  },
  watch: {},
  methods: {
    handleOutsideClick () {
      this.$refs.brain_area.handleOutsideClick()
    },
    toWiki () {
      if (!this.careBrain || this.careBrain === "") {
        this.$message.info("Please select a brain part");
        return;
      }
      // const url = this.BRAIN_STRUCTURE.has(this.careBrain)
      //   ? this.BRAIN_STRUCTURE.get(this.careBrain)
      //   : "https://en.wikipedia.org/wiki/" + this.careBrain;
      window.open(BrainDetails[this.careBrain].wikiUrl);
    },
  },
  async mounted () {
    const methods = await this.$store.dispatch(
      "xlsxRead/fetchXlsxData",
      "BRAIN_STRUCTURE"
    );
    let BRAIN_STRUCTURE = new Map();
    methods.map((item) => {
      BRAIN_STRUCTURE.set(item["名称"], item["维基百科链接"]);
    });
    this.BRAIN_STRUCTURE = BRAIN_STRUCTURE;
  },
};
</script>
<style lang="scss" scoped>
.box-card {
  margin: 20px 0;
}
</style>
