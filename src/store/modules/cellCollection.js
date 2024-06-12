import { postCSV } from "@/api/system.js";
const getDefaultState = () => {
  return {
    steps: [],
    currentStep: {},
    analysisResult: {},
    applyResult: [],
    staticSteps: false, // 首页固定step 不可修改
    // queryLang: ''
    cellTree: [],
    organTree: {},
    isApply: false,
    portraitCellsorting: [],
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  CURRENT_STEP: (state, step) => {
    state.currentStep = step;
  },
  STEPS: (state, steps) => {
    state.steps = steps;
  },
  STATICSTEPS: (state, staticSteps) => {
    state.staticSteps = staticSteps;
  },
  ANALYSIS_RESULT: (state, res) => {
    state.analysisResult = res;
  },
  APPLY_RESULT: (state, res) => {
    const idx = state.applyResult.findIndex(
      (item) => item.stepId == res.stepId
    );
    if (idx > -1) {
      state.applyResult.splice(idx, 1, res);
    } else state.applyResult.push(res);
  },
  // QUERY_LANG: (state, lang) => {
  //   state.queryLang = lang
  // }
  CELL_TREE: (state, cellTree) => {
    state.cellTree = cellTree;
  },
  ORGAN_TREE: (state, node) => {
    state.organTree[node.label] = node.value;
  },
  PORTRAITCELLSORTING: (state, portraitCellsorting) => {
    state.portraitCellsorting = portraitCellsorting;
  },
};

const actions = {
  async fetchOrgantree({ commit, state }, filter) {
    if (state.organTree[filter]) {
      return state.organTree[filter];
    }
    const result = await postCSV({
      fileName: "csv/HeartRegionTree.csv",
      filters: [
        {
          column: "Parent",
          filter,
        },
      ],
    });
    commit("ORGAN_TREE", { label: filter, value: result.Region });
    return result.Region;
  },
  async fetchCelltree({ commit, state }) {
    if (state.cellTree.length > 0) {
      return state.cellTree;
    }
    const result = await postCSV({
      fileName: "csv/HeartCellTree.csv",
      filters: [
        // {
        //   column: "Parent",
        //   filter:'',
        // },
      ],
    });
    const parentnode = result.Parent;
    const celltyps = result["Cell type"];
    let chartData = celltyps.map((item, i) => {
      return { label: item, parent: parentnode[i] };
    });
    const parentFn = (pNode) => {
      pNode.children = chartData
        .map((cell) => {
          if (cell.parent == pNode.label) {
            return { label: cell.label, children: [] };
          }
        })
        .filter((val) => val);

      if (pNode.children.length > 0) {
        pNode.children.forEach((node) => {
          if (node.label == "Fibroblast" && pNode.label == "Fibroblast") return;
          parentFn(node);
        });
      } else {
      }
    };
    let nodes = { label: "Cell", children: [] };
    parentFn(nodes);

    commit("CELL_TREE", [nodes]);
    return [nodes];
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
