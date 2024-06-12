import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import getters from "./getters";
import app from "./modules/app";
import cellCollection from "./modules/cellCollection";
import xlsxRead from "./modules/xlsxRead";

const store = new Vuex.Store({
  modules: {
    app,
    cellCollection,
    xlsxRead,
  },
  getters,
});

export default store;
