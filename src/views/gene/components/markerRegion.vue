<template>
  <div>
    <b-pane-label label="REGION" />
    <geneSearch v-model="searchRegion" :data="regionData" />

  </div>
</template>
<script>
import { REGION } from "@/utils/Atlas";
import RegionDEG from "@/utils/RegionDEG.json";
export default {
  name: "MarkerRegion",
  props: {
    value: {
      type: String,
      default: "",
    },
    data: {
      type: Array,
      default: () => [],
    },
    regionDEG: {
      type: Boolean,
      default: false,
    },
    atlas: {
      type: String,
      default: "Adult",
    },
    VolcanoBy: {
      type: String,
      default: "",
    },
  },
  components: {
    geneSearch: () => import("./geneSearch.vue"),
  },
  watch: {
    value (val) {
      this.searchRegion = val;
    },
    data: {
      handler (val) {
        this.regionData = val;
      },
      immediate: true
    },
    searchRegion: {
      handler (val) {
        this.$emit("change", val);
        this.$emit("input", val);
      }
    },
    atlas: {
      handler (val) {
        this.searchRegion = this.value
        if (this.regionDEG) {  // if regionDEG is true, then use RegionDEG.json
          val != '' && (this.regionData = RegionDEG[val])
        } else {  // if regionDEG is false, then use Atlas.json
          this.regionData = this.data
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      searchRegion: this.value,
      REGION,
      regionData: []
    };
  },
  methods: {

  },
  async mounted () {
    if (this.regionDEG) {
      this.regionData = RegionDEG[this.atlas]
    } else {
      this.regionData = this.data
    }
  },
};
</script>
