import { getCellTypeNodeData } from "@/api/common";
import { postCSV } from "@/api/system";
const state = {
  cellTypeTree: null,
  colorsEnum: {},
  cellType: null,
  dict: {},
  structuralUnit: [
    "LV",
    "RV",
    "IVS",
    "LA",
    "RA",
    "IAS",
    "MV",
    "TV",
    "AO",
    "PA",
    "VC",
    "PV",
    "CA",
    "LCA",
    "RCA",
    "CV",
    "GCV",
    "MCV",
    "SCV",
  ],
  pathway: [
    "ACTIVIN",
    "ADIPONECTIN",
    "ANGPT",
    "ANGPTL",
    "BAFF",
    "BMP",
    "BMP10",
    "BTLA",
    "CADM",
    "CALCR",
    "CCL",
    "CD22",
    "CD23",
    "CD40",
    "CD45",
    "CD46",
    "CD80",
    "CD86",
    "CDH",
    "CDH5",
    "CNTN",
    "COLLAGEN",
    "COMPLEMENT",
    "CSF",
    "CSF3",
    "CXCL",
    "EDA",
    "EDN",
    "EGF",
    "EPHA",
    "EPHB",
    "EPO",
    "FGF",
    "FLT3",
    "FN1",
    "FSH",
    "GAS",
    "GDNF",
    "GH",
    "GP1BA",
    "HGF",
    "ICAM",
    "IFN-I",
    "IFN-II",
    "IGF",
    "IL1",
    "IL16",
    "IL2",
    "IL4",
    "IL6",
    "ITGAL-ITGB2",
    "KIT",
    "L1CAM",
    "LAMININ",
    "LEP",
    "LIFR",
    "LIGHT",
    "LT",
    "MPZ",
    "MSTN",
    "NCAM",
    "NEGR",
    "NGF",
    "NOTCH",
    "NRG",
    "NRXN",
    "NT",
    "OCLN",
    "PARs",
    "PDGF",
    "PECAM1",
    "PTPRM",
    "SEMA3",
    "SEMA4",
    "TENASCIN",
    "TGFb",
    "THBS",
    "THY1",
    "TRAIL",
    "VEGF",
    "VISFATIN",
    "VTN",
    "WNT",
  ],
  cachedViews:[]
};

const mutations = {
  CELL_TYPE_TREE(state, tree) {
    state.cellTypeTree = tree;
  },
  SET_COLORS(state, colors = {}) {
    state.colorsEnum = colors;
  },
  DICT_TYPE(state, { dataType, tree }) {
    state.dict[dataType] = tree;
  },
  ADD_CACHED_VIEW: (state, view) => {
    // if (state.cachedViews.includes(view.name)) return
    if (view.meta.keepAlive) {
      if(view.meta.pName){
        const pIndex = state.cachedViews.findIndex(item => item === view.meta.pName)
        if(pIndex == -1){
          state.cachedViews.push(view.meta.pName)
        }
      }
      const index = state.cachedViews.findIndex(item => item === view.name)
      if(index === -1){
        state.cachedViews.push(view.name)
      }
    }
    // if(!view.meta.keepAlive){
    //   const index = state.cachedViews.findIndex(item => item === view.name)
    //   if(index > -1){
    //     state.cachedViews.splice(index,1)
    //   }
    //   if(view.meta.pName){
    //     const pIndex = state.cachedViews.findIndex(item => item === view.meta.pName)
    //     if(pIndex > -1){
    //       state.cachedViews.splice(pIndex,1)
    //     }
    //   }
    // }
  },
};

const actions = {
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },

  fetchCellTypeTree({ commit, state }) {
    if (state.cellTypeTree != null) {
      return Promise.resolve(state.cellTypeTree);
    } else {
      return getCellTypeNodeData().then((zNodes) => {
        commit("CELL_TYPE_TREE", zNodes);
        return zNodes;
      });
    }
  },
  //获取cell type
  async fetchDicts({ commit, state }, params) {
    const { param, dataType } = params;
    if (state.dict[dataType] != null) {
      return state.dict[dataType];
    } else {
      return new Promise(async (resolve) => {
        const result = await postCSV(param);
        commit("DICT_TYPE", { dataType, tree: result.C0 || result.x });
        resolve(result.C0 || result.x);
      });
    }
  },
  fetchColor({ commit, state }, params) {
    return new Promise(async (resolve, reject) => {
      postCSV(params)
        .then((res) => {
          const data = {};
          const { type = [], color = [] } = res || {};
          type.forEach((item, i) => {
            data[item] = color[i];
          });
          commit("SET_COLORS", data);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
