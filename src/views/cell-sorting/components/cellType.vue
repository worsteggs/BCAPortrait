<template>
  <div class="filter-cell">
    <div style="flex: 1;display: flex;">
      <el-checkbox class="filter-check-txt" v-model="params.notFlag"
        >Exclude</el-checkbox
      >
      <span class="filter-cell-label">Cell Type</span>
      <div
        style="display: inline-block; vertical-align: text-top; width: 187px;flex: 1;"
      >
        <el-dropdown
          :trigger="disabled ? 'disabled' : 'click'"
          placement="bottom-start"
        >
          <el-input
            id="cellTypeTreeSearch"
            v-model="filterText"
            style="width: 187px"
            :class="{ 'el-input_border': iptBlueBorder() }"
            placeholder="Filter by name"
            :disabled="disabled"
            clearable
          />
          <el-dropdown-menu slot="dropdown">
            <div class="dropdownTreeWapper">
              <div align="right">
                <el-checkbox v-model="cellCheck" @change="subtypesCheckbox">
                  include subtypes
                </el-checkbox>
              </div>
              <el-tree
                ref="tree"
                class="filter-tree"
                :default-expanded-keys="['Cell']"
                :default-checked-keys="params.cellType"
                node-key="label"
                :data="zNodes"
                show-checkbox
                :filter-node-method="filterNode"
                :check-strictly="cellStrictly"
                @check-change="checkChange"
              />
            </div>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tag style="width: 187px;margin-left: 10px;">
            &nbsp; {{ params.cellType ? params.cellType.length : 0 }} cell types
            selected&nbsp;
          </el-tag>
        <div>
          <!-- <el-tag style="width: 187px">
            &nbsp; {{ params.cellType ? params.cellType.length : 0 }} cell types
            selected&nbsp;
          </el-tag> -->
          <div class="cellType-item" v-if="params.cellType && params.cellType.length">
            <el-tag v-for="(item,i) in params.cellType" :key="i">
              {{ item }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
    <filterIcon questionTip="Select cells annotated as one or several cell types" @close="$emit('close')" />
  </div>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
      default: function () {
        return {
          cellType: [],
        };
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
  data() {
    return {
      filterText: "",
      zNodes: [],
      cellCheck: true,
      cellStrictly: false,
      nodes: {},
    };
  },
  watch: {
    filterText(val) {
      if (val) {
        this.$refs.tree.filter(val);
      }
    },
  },
  async created() {
    const nodes = await this.celltypeChange();
    this.zNodes = nodes;
    this.setCellDisabled(this.zNodes[0]);
  },

  methods: {
    async celltypeChange() {
      const node = await this.$store.dispatch("cellCollection/fetchCelltree");

      return node;
    },
    iptBlueBorder() {
      return !!(this.params.cellType && this.params.cellType.length > 0);
    },
    subtypesCheckbox(value) {
      this.cellStrictly = !value;
    },
    setCellDisabled(node, parentNode = null) {
      if (node.type === 0 && node.label !== "Cell") {
        const children = parentNode ? parentNode.children : [];
        parentNode.children = children.filter((d) => d.id !== node.id);
      }
      if (node.children) {
        node.children.forEach((item) => {
          this.setCellDisabled(item, node);
        });
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    checkChange() {
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      this.params.cellType = Array.from(
        new Set(checkedNodes.map((e) => e.label))
      );
      this.$forceUpdate();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./filter-cell-scss.scss";
</style>
<style>
.dropdownTreeWapper {
  max-height: 400px;
  max-width: 600px;
  min-height: 20px;
  min-width: 400px;
  overflow: auto;
  padding: 10px;
}
</style>
