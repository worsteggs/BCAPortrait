<template>
  <div>
    <b-pane-label label="METHOD" />
    <geneSearch v-model="searchRegion" :data="METHODS" isMethod @change="handleCheckChange" />
  </div>
</template>
<script>
// import { METHODS } from "@/utils/Atlas";
export default {
  name: "MarkerRegion",
  components: {
    geneSearch: () => import("./geneSearch.vue")
  },
  data () {
    return {
      searchRegion: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      METHODS: [],
    };
  },
  computed: {},
  methods: {
    handleCheckChange (data) {
      let arr = data;
      if (data.includes("All")) {
        const all = this.METHODS.map((item) => item.value);
        this.searchRegion = all;
        arr = [...data, ...all];
      }
      this.$emit("input", arr);
      this.$emit("change", arr);
    },
  },
  async mounted () {
    const methods = await this.$store.dispatch(
      "xlsxRead/fetchXlsxData",
      "METHODS"
    );
    // console.log(methods, '999999999999');
    this.METHODS = methods.map((item) => {
      return {
        value: item.Annotation,
        label: item.Annotation,
      };
    });
  },
};
</script>
