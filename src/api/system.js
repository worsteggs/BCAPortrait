import request from "@/utils/request";
export function postCSV(params) {
  return request.post("/api/system/common/readCSV", params);
}
export function getJson(url) {
  return request.get(`/json/${url}?create_time=${+new Date()}`);
}

export function getFile(url) {
  return request.get(`${url}?create_time=${+new Date()}`);
}
export function getFileBin(url) {
  return request.get(`${url}`, {responseType: "arraybuffer"});
}