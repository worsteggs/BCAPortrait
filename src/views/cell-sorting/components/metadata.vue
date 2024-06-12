<template>
  <div class="filter-cell">
    <div>
      <el-checkbox class="filter-check-txt" v-model="params.notFlag">Exclude</el-checkbox>
      <span class="filter-cell-label">Metadata</span>

      <el-select v-model="params.metadataType" :disabled="disabled" placeholder="please select" @change="metadataTypeChange">
        <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value" />
      </el-select>
      <el-select v-if="params.metadataType" v-model="metadataValue" :disabled="disabled" placeholder="please select" style="margin-left: 10px; width: 200px" @change="(val) => (params.metadataValue = val)">
        <el-option v-for="item in valoptions[valoptionsName]" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
    <filterIcon questionTip="Select cells by setting other kinds of filters" @close="$emit('close')" />
  </div>
</template>
<script>
import { postCSV } from "@/api/system.js";
export default {
  props: {
    params: {
      type: Object,
      default: function () {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    filterIcon: () => import("./filterIcon"),
  },
  data () {
    return {
      value: "",
      options: [],
      valoptions: {},
      valoptionsName: '',
      metadataValue: ""
    }
  },
  mounted () {
    this.fetchMetadata();
    this.metadataValue = this.params.metadataValue;
  },
  computed: {
    currentStep () {
      return this.$store.state.cellCollection.currentStep;
    },
  },
  watch: {},
  methods: {
    async metadataTypeChange (metadataType) {
      let _value = this.options.find((val) => val.value == metadataType).name;
      this.valoptionsName = _value
      this.params.metadataValue = "";
      this.metadataValue = "";
    },
    async fetchMetadata () {
      this.loading = true;
      try {
        const result = await postCSV({
          fileName: "csv/sorting.csv",
          groupBy: 'orgin_key'
          // filters: [
          //   {
          //     column: "key",
          //     filter: value,
          //   },
          // ],
        });
        const options = []
        const valoptions = {}
        Object.keys(result).forEach(key => {
          options.push({ name: key, value: result[key].key[0] });
          valoptions[key] = result[key].value
        })
        this.options = options
        this.valoptions = valoptions
      } catch (error) {
        console.log(error)
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./filter-cell-scss.scss";
</style>
