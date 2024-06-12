import request from "@/utils/request.js";
// /system/search/sorting
export function sorting(params) {
  return request.post("/api/system/search/sorting", params);
}
