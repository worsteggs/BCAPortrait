const getters = {
  cellTypeTree: (state) => state.app.cellTypeTree,
  colorsEnum: (state) => state.app.colorsEnum,
  dict: (state) => state.app.dict,
  structuralUnit: (state) => state.app.structuralUnit, //4.5, 5.6(1)
  pathway: (state) => state.app.pathway, //4.7
  cachedViews: (state) => state.app.cachedViews,
  CELLTYPE: (state) => state.xlsxRead.CELLTYPE,
  METHODS: (state) => state.xlsxRead.METHODS,
  REGION: (state) => state.xlsxRead.REGION,
  BRAIN_STRUCTURE: (state) => state.xlsxRead.BRAIN_STRUCTURE,
};
export default getters;
