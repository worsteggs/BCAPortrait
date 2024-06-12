<template>
  <div>
    <b-pane-label label="REGION" />
    <geneSearch v-model="searchRegion" :data="RegionDEG" />
  </div>
</template>
<script>
import RegionDEG from "@/utils/RegionDEG.json";
export default {
  name: "MarkerRegion",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  components: {
    geneSearch: () => import("./geneSearch.vue"),
  },
  mounted () {
    console.log(RegionDEG);
  },
  watch: {
    value (val) {
      this.searchRegion = val;
    },
    searchRegion: function (val) {
      this.$emit("change", val);
      this.$emit("input", val);
    },
  },
  data () {
    return {
      searchRegion: this.value,
      REGION,
    };
  },
  methods: {
    handleNodeClick (data) {
      console.log(data);
      this.searchRegion = data.label;
    },
  },
  async mounted () {
    const methods = await this.$store.dispatch(
      "xlsxRead/fetchXlsxData",
      "REGION"
    );
    let arr = [];
    methods.map((item) => {
      let _idx = arr.findIndex((val) => val.label == item.Region);
      if (_idx < 0) {
        arr.push({
          label: item.Region,
          value: item.Region,
          [item.Subregion ? "children" : null]: item.Subregion
            ? [{ label: item.Subregion, value: item.Subregion }]
            : [],
        });
      }
      if (_idx > -1) {
        item.Subregion &&
          arr[_idx].children.push({
            label: item.Subregion,
            value: item.Subregion,
          });
      }
      return {
        value: item.Region,
        label: item.Region,
      };
    });
    // this.REGION = arr;
  },
};
</script>
