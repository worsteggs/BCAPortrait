<template>
  <div>
    <b-pane-label label="CELLTYPE"></b-pane-label>
    <geneSearch v-model="searchRegion" :data="CELLTYPE" />
  </div>
</template>
<script>
import { CELLTYPE } from "@/utils/Atlas";

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
      CELLTYPE,
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
      "CELLTYPE"
    );
    let arr = [];
    methods.map((item) => {
      let _idx = arr.findIndex((val) => val.label == item.Parent);
      if (_idx < 0) {
        arr.push({
          label: item.Parent,
          value: item.Parent,
          [item["Cell Type"] ? "children" : null]: item["Cell Type"]
            ? [{ label: item["Cell Type"], value: item["Cell Type"] }]
            : [],
        });
      }
      if (_idx > -1) {
        item["Cell Type"] &&
          arr[_idx].children.push({
            label: item["Cell Type"],
            value: item["Cell Type"],
          });
      }
      return {
        value: item.Region,
        label: item.Region,
      };
    });
    // this.CELLTYPE = arr;
  },
};
</script>
