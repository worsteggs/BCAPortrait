import * as XLSX from "xlsx";
const state = {
  CELLTYPE: null,
  METHODS: null,
  REGION: null,
  BRAIN_STRUCTURE: null,
};
const mutations = {
  SET_CELLTYPE(state, tree) {
    state.CELLTYPE = tree;
  },
  SET_METHODS(state, tree) {
    state.METHODS = tree;
  },
  SET_REGION(state, tree) {
    state.REGION = tree;
  },
  SET_BRAIN_STRUCTURE(state, tree) {
    state.BRAIN_STRUCTURE = tree;
  },
};
const SHEETS_NAME = {
  CellType树状结构: "CELLTYPE",
  "Method (Annotation)": "METHODS",
  Region树状结构: "REGION",
  成人大脑结构和链接: "BRAIN_STRUCTURE",
};
const actions = {
  fetchXlsxData({ commit, state }, type) {
    if (state[type] != null) {
      return Promise.resolve(state[type]);
    } else {
      // xhttp获取本地文件
      let data = {};
      return new Promise(async (resolve) => {
        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/js/website_trees.xlsx", !0);
        xhttp.responseType = "arraybuffer";
        xhttp.onreadystatechange = function () {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            const blob = new Uint8Array(xhttp.response);
            // 读取得到整份excel表格对象
            const workbook = XLSX.read(blob, {
              type: "array",
            });
            // console.log("=====", workbook);
            // 遍历每张表读取
            for (let sheet in workbook.Sheets) {
              if (workbook.Sheets.hasOwnProperty(sheet)) {
                // console.log(sheet);
                let tmplist = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                commit(`SET_${SHEETS_NAME[sheet]}`, tmplist);
                data[SHEETS_NAME[sheet]] = tmplist;
                // console.log("tmplist", data[SHEETS_NAME[sheet]]);
              }
            }
            // return data[type];
            // console.log("data", data[type]);
            resolve(data[type] || []);
          }
        };
        xhttp.send();
      });
    }
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
