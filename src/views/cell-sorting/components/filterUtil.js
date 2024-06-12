import { Message } from "element-ui";
// eslint-disable-next-line

function isNum(s) {
  if (s !== null && s !== "") {
    return !isNaN(s);
  }
  return false;
}
function empty(val) {
  return val === undefined || val === null || val === "";
}
function msg(stepOrder, errorObj) {
  Message({
    message: `[Step${stepOrder}] ${errorObj} cannot be empty`,
    type: "warning",
    offset: 100,
  });
}
function msgNum(stepOrder, errorObj) {
  Message({
    message: `[Step${stepOrder}] ${errorObj} must be numeric`,
    type: "warning",
    offset: 100,
  });
}
var metaTypeMap = {
  cl_name: "Cl Name",
  donor_id: "Donor Id",
  donor_gender: "Donor Gender",
  donor_age: "Donor Age",
  region: "Region",
  subregion: "Sub region",
  sample_status: "Sample Status",
  seq_tech: "Seq Tech",
};
export function filterCheck(step, filterContent) {
  console.log("js filters step ", step);
  filterContent = filterContent || {};
  const stepOrder = step.stepOrder + 1;

  let filterNum = 0;
  let result = true;
  step.filters.forEach((orFilters) => {
    orFilters.forEach((filter) => {
      if (filter.type === "CellType") {
        if (empty(filter.params.cellType)) {
          msg(stepOrder, "CellType");
          result = false;
          return false;
        }
        filterNum++;
        filterContent["CellType"] = filterContent["CellType"] || [];
        filterContent["CellType"] = filterContent["CellType"].concat(
          filter.params.cellType
        );
      } else if (filter.type === "Keyword") {
        console.log("");
        filterNum++;
        filterContent["Keyword"] = filterContent["Keyword"] || [];
        filterContent["Keyword"].push(filter.params.keyword);
      } else if (filter.type === "Gene") {
        let content = "";
        if (
          empty(filter.params.gene) ||
          (empty(filter.params.min) && empty(filter.params.max))
        ) {
          msg(stepOrder, "Gene");
          result = false;
          return false;
        }
        if (!isNum(filter.params.min)) {
          msgNum(stepOrder, "Gene min value");
          result = false;
          return false;
        }
        if (!isNum(filter.params.max)) {
          msgNum(stepOrder, "Gene max value");
          result = false;
          return false;
        }
        content += filter.params.gene;
        if (!empty(filter.params.min)) {
          content += " min：" + filter.params.min;
        }
        if (!empty(filter.params.max)) {
          content += " max：" + filter.params.max;
        }
        filterNum++;
        filterContent["Gene"] = filterContent["Gene"] || [];
        filterContent["Gene"].push(content);
      } else if (filter.type === "Organ") {
        console.log("filter.type=Organ ", filter.params.organ);
        if (
          filter.params.organ.length <= 0 ||
          filter.params.organ.indexOf("") > -1
        ) {
          msg(stepOrder, "Organ");
          result = false;
          return false;
        }
        filterNum++;
        filterContent["Organ"] = filterContent["Organ"] || [];
        filterContent["Organ"] = filterContent["Organ"].concat(
          filter.params.organ
        );
      } else if (filter.type === "Metadata") {
        if (
          empty(filter.params.metadataType) ||
          empty(filter.params.metadataValue)
        ) {
          msg(stepOrder, "Metadata");
          result = false;
          return false;
        }
        filterNum++;
        filterContent[metaTypeMap[filter.params.metadataType]] =
          filterContent[filter.params.metadataType] || [];
        filterContent[metaTypeMap[filter.params.metadataType]].push(
          filter.params.metadataValue
        );
      } else if (filter.type === "sample_type") {
        if (empty(filter.params.sample_type)) {
          msg(stepOrder, "sample_type");
          result = false;
          return false;
        }
        filterNum++;
        filterContent["sample_type"] = filterContent["sample_type"] || [];
        filterContent["sample_type"].push(filter.params.sample_type);
      }
    });
  });
  if (result && filterNum <= 0) {
    Message({
      message: "No found Filter,Please select",
      type: "warning",
      offset: 100,
    });
    result = false;
    return false;
  }
  return result;
}

export function isfilterFirstGeneCheck(step) {
  step.filters.forEach((orFilters) => {
    orFilters.forEach((filter) => {});
  });
  if (
    step &&
    step[0] &&
    step[0][0] &&
    step[0][0].type === "Gene" &&
    step.stepOrder === 0
  ) {
    Message({
      message: "The first filter cannot be a gene",
      type: "warning",
      offset: 100,
    });
    return false;
  }
  return true;
}
