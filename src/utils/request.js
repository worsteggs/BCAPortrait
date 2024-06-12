import axios from "axios";
import { MessageBox, Message } from "element-ui";
// import store from "@/store";

// create an axios instance
const service = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "/" : "/api", // url = base url + request url
  timeout: 2 * 60 * 1000, // request timeout
});
const config = (config) => {
  // if (store.getters.token) {
  //   config.headers.Authorization = "Bearer " + store.getters.token; // 让每个请求携带自定义token 请根据实际情况自行修改
  // }
  return config;
};
// request interceptor
service.interceptors.request.use(config, (error) => {
  // do something with request error
  Promise.reject(error);
});

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    if (response.request.responseType === "arraybuffer") {
      return res;
    }
    // if the custom code is not 20000, it is judged as an error.
    if (!res.ret) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      return res;
    } else {
      return res.result;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    const errCode = error.response.status;
    const msg = error.response?.data?.message || error;
    if (errCode !== 404) {
      if (document.getElementsByClassName("el-message").length < 1) {
        Message({
          message: msg,
          type: "error",
          duration: 5 * 1000,
          customClass: "zZindex",
          offset: 100,
        });
      }
    }
    return Promise.reject(error);
  }
);

export default service;
