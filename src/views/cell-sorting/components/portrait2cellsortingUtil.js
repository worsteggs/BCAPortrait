import * as XLSX from "xlsx";

export function portraitSampleType(Vue) {
  // 判断是否从portrait脑结构跳转过来
  return Vue.$route.query.sample_type;
}
/**
 * 获取脑结构图对应的region与subregion，文件 portrait2cellsorting.xlsx
 */
export async function fetchPortraitXlsx() {
  // xhttp获取本地文件
  // let self = this;
  return new Promise(async (resolve) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/js/portrait2cellsorting.xlsx", !0);
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
        let tmplist = XLSX.utils.sheet_to_json(workbook.Sheets["Sheet1"]);
        // self.$store.commit("cellCollection/PORTRAITCELLSORTING", tmplist);
        // console.log("tmplist", tmplist);
        resolve(tmplist || []);
      }
    };
    xhttp.send();
  });
}
