<template>
  <div class="layout-wrap">
    <!-- <Header /> -->
    <keep-alive :include="cachedViews">
      <router-view style="flex: 1" :key="key"></router-view>
    </keep-alive>
    <component v-for="item in iframeComponent" :key="item.path" :is="item.meta.componentName" v-show="item.path == $route.path && !item.meta.hidden"></component>
    <!-- <div style="height: 48px"></div> -->
    <!-- <Footer /> -->
  </div>
</template>
<script>
import Header from "./Header";
import Footer from "./Footer";
import { mapGetters } from "vuex";
export default {
  components: {
    Header,
    Footer,
    Adult: () => import("@/views/dataBrowser/AdultBrowser"),
    Fetal: () => import("@/views/dataBrowser/FetalBrowser"),
    Organoid: () => import("@/views/dataBrowser/OrganoidBrowser"),
    Tumour: () => import("@/views/dataBrowser/TumourBrowser"),
    Mouse: () => import("@/views/dataBrowser/MouseBrowser"),
  },
  data () {
    return {
      isIframe: false,
      iframeComponent: [],
    };
  },
  computed: {
    ...mapGetters(["cachedViews"]),
    key () {
      return this.$route.path;
    },
  },
  watch: {
    $route: {
      handler (route) {
        this.$store.dispatch("app/addCachedView", route);

        this.filterIframeRouter(route);
        const mainPath = route.path.split("/")[1];
        console.log(mainPath)
        if (mainPath === 'contact' || mainPath === 'gene') {
          document.body.style.backgroundColor = '#F7F8FA'
        } else {
          document.body.style.backgroundColor = 'white'
        }
        if (mainPath === 'cellSorting') {
          // 直接点击cellsorting菜单跳转的路由，区分脑结构图跳转过来的情况
          this.$store.commit('cellCollection/STEPS', [])
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 筛选需要keepAlive的路由的name集合
    filterAliveRouter (routerList = [], cachedList = []) {
      routerList.forEach((item) => {
        if (item.meta.keepAlive) {
          cachedList.push(item.name);
        }
        if (item.children?.length) {
          this.filterAliveRouter(item.children, cachedList);
        }
      });
      return cachedList;
    },
    isOpenIframePage (route) {
      const target = this.iframeComponent.find((item) => {
        return item.path === route.path;
      });
      if (target && target.meta.hidden) {
        target.meta.hidden = false;
      }
    },
    filterIframeRouter (route) {
      if (route.meta.isIframe) {
        let idx = this.iframeComponent.findIndex(
          (item) => item.path == route.path
        );
        if (idx == -1) {
          this.iframeComponent.push(route);
        }
      }
      this.isOpenIframePage(route);
    },
  },
};
</script>
<style lang="scss" scoped>
.layout-wrap {
  display: flex;
  flex-flow: column;
  min-height: 100vh;
  // max-width: 1440px;
  // width: 100%;
  // margin: 0 auto;
}
</style>
