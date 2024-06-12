<template>
  <div>
    <b-pane-label label="CELLTYPE"></b-pane-label>
    <geneSearch v-model="searchRegion" :data="cellTypeData" />
  </div>
</template>
<script>
import CellTypeDEG from "@/utils/CellTypeDEG.json";
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
    cellTypeDEG: {
      type: Boolean,
      default: false,
    },
    atlas: {
      type: String,
      default: "Adult",
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
        this.cellTypeData = val;
      },
      deep: true
    },
    searchRegion: {
      handler (val) {
        this.$emit("change", val);
        this.$emit("input", val);
      },
    },
    atlas: {
      handler (val) {
        this.searchRegion = this.value
        if (this.cellTypeDEG) {  // if regionDEG is true, then use CellTypeDEG.json
          val != '' && (this.cellTypeData = CellTypeDEG[val])
        } else {  // if regionDEG is false, then use VolcanoByCellType.json
          this.cellTypeData = this.data
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      searchRegion: this.value,
      cellTypeData: []
    };
  },
  methods: {
    handleNodeClick (data) {
      console.log(data);
      this.searchRegion = data.label;
    },
  },
  async mounted () {
    if (this.cellTypeDEG) {
      this.cellTypeData = CellTypeDEG[this.atlas.split(" ")[0]]
    } else {
      this.cellTypeData = this.data
    }
  },
};
</script>
