import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layout/index.vue";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/",
    name: "index",
    redirect: "/index",
    component: () => import("@/views/index"),
  },
  {
    path: "/layout",
    name: "layout",
    component: Layout,
    redirect: "/index",
    children: [
      {
        path: "/index",
        name: "index",
        component: () => import("@/views/index/index2.vue"),
        meta: {
          title: "Home",
          keepAlive: true,
        },
      }
    ],
  },
];

const router = new VueRouter({
  routes,
  scrollBehavior: () => ({
    y: 0,
  }),
});
export default router;
