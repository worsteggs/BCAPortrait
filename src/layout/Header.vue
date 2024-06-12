<template>
  <div class="header-box" id="headerBox">
    <div class="header-wrap wrap">
      <div class="header-wrap-menu" ref="header_menu">
        <span class="header-logo" @click="$router.push({ path: '/index' })">
          <!-- svg图标 -->
          <!-- <svg-icon icon-class="braincellatlaslogo" /> -->
          <img src="@/assets/img/braincellatlaslogo.svg" alt="" width="160" height="60">
        </span>
        <div class="el-menu-block">
          <el-menu mode="horizontal" :default-active="activeIndex" text-color="#333333" active-text-color="#1e5dbc" class="header-menus">
            <template v-for="menu in menus">
              <el-submenu :key="menu.path" :index="menu.path" v-if="menu.children && menu.children.length > 0">
                <template slot="title">{{ menu.meta.title }} </template>
                <el-menu-item v-for="item in menu.children" :key="item.path" :index="item.path">
                  <router-link :to="item.path">{{
                  item.meta.title
                }}</router-link></el-menu-item>
              </el-submenu>
              <el-menu-item :key="menu.path" :index="menu.path" v-else>
                <router-link :to="menu.path">{{
                menu.meta.title
              }}
                </router-link>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
        <span></span>
        <div ref="mobile_menu" class="mobile-menu-block">
          <div class="active-menu" @click="toggleMenu">{{ routeName }}<i class="el-icon-caret-bottom" :class="{'up': mobileCollapse}" /></div>
          <el-menu v-show="mobileCollapse" class="mobile-menu" :default-active="activeIndex" :collapse="true" @select="toggleMenu">
            <template v-for="menu in menus">
              <el-submenu :key="menu.path" :index="menu.path" v-if="menu.children && menu.children.length > 0">
                <template slot="title">{{ menu.meta.title }} </template>
                <el-menu-item v-for="item in menu.children" :key="item.path" :index="item.path">
                  <router-link style="display:block" :to="item.path">{{
                  item.meta.title
                }}</router-link></el-menu-item>
              </el-submenu>
              <el-menu-item :key="menu.path" :index="menu.path" v-else>
                <router-link style="display:block" :to="menu.path">{{
                menu.meta.title
              }}
                </router-link>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: "",
      searchFocus: false,
      activeIndex: "/index",
      menus: [],
      mobileCollapse: false,
    };
  },
  watch: {
    $route (to) {
      console.log(to)
      this.activeIndex = to.path
      if (to.fullPath === '/index') {
        document.getElementById('headerBox').style.backgroundColor = '#f4f3f9'
      } else {
        document.getElementById('headerBox').style.backgroundColor = '#fff'
      }
    },
  },
  computed: {
    routeName () {
      return this.$route.meta?.menu ?? 'Menu'
    }
  },
  created () {
    const routes = require("@/router").routes.find((v) => v.name === "layout");
    const menus = routes.children ?? [];
    this.menus = menus.filter((item) => !item.hidden);
    // this.menus = routes.children ?? [];
  },
  mounted () {
    this.activeIndex = this.$route.path
    document.addEventListener('click', (e) => {
      if (!this.$refs.mobile_menu.contains(e.target)) this.mobileCollapse = false
    })
  },
  methods: {
    toggleMenu (e) {
      this.$nextTick(() => {
        this.mobileCollapse = !this.mobileCollapse
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.header-box {
  background: #fff;
  height: 84px;
  position: sticky;
  top: 0;
  z-index: 99;
  box-shadow: 0px 1px 2px #eff5fe;
}
.header-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
  &-menu {
    font-size: 18px;
    display: flex;
    @include wrapPadding;
    overflow-x: auto;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  }
  .header-menus {
    flex: 1;
    // width: 1300px;
    justify-content: center;
    background: transparent;
    border-bottom: none;
    a {
      display: inline-block;
    }
  }
  .mobile-menu-block {
    width: 140px;
    cursor: pointer;
    .active-menu {
      text-align: center;
      color: $themeColor;
      font-size: 20px;
    }
    .mobile-menu {
      width: 140px;
      position: absolute;
      top: 70px;
      z-index: 99;
    }
    i.el-icon-caret-bottom {
      transition: all 0.5s;
      &.up {
        transform: rotate(180deg);
      }
    }
  }
}
.header-logo {
  text-align: left;
  font-weight: bold;
  // line-height: 18px;
  font-family: ARS Maquette Pro-Bold, ARS Maquette Pro;
  background-clip: text;
  // margin-right: 40px;
  // color: $themeColor;
  svg {
    // font-size: 180px;
    width: 160px;
    height: 60px;
    cursor: pointer;
    color: #23255f;
  }
}
.header-search {
  border-radius: 8px;
  background: #f7fafc;
  display: flex;
  align-items: center;
  position: relative;
  height: 40px;
  .el-icon-search {
    padding: 10px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 333;
  }
  .el-icon-search {
    color: #666;
  }
  &.search-focus {
    border-color: $themeColor;
    .el-icon-search {
      color: $themeColor;
    }
  }
}
</style>
<style lang="scss">
.header-menus {
  padding-top: 3px;
  display: flex;
  .el-menu-item,
  .el-submenu__title {
    font-size: 16px;
    font-family: Alibaba PuHuiTi 2-65 Medium, Alibaba PuHuiTi 20;
    background-clip: text;
  }
  .el-menu-item * {
    vertical-align: bottom;
  }
}
.el-menu--horizontal {
  .el-menu-item {
    float: none !important;
    &.is-active {
      a {
        color: rgb(30, 93, 188);
      }
    }
    a {
      display: block;
    }
  }
}

.header-search-input .el-input__inner {
  padding-left: 36px;
  background: none;
}
.header-wrap {
  .el-menu.el-menu--horizontal {
    border-bottom-color: #1e5dbc !important;
  }
  .el-menu--horizontal > .el-menu-item.is-active,
  .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
    border-bottom-color: #1e5dbc !important;
    line-height: 60px !important;
  }
  .el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
  .el-menu--horizontal .el-menu-item:not(.is-disabled):hover,
  .el-menu--horizontal > .el-submenu:focus .el-submenu__title,
  .el-menu--horizontal > .el-submenu:hover .el-submenu__title {
    color: $themeColor;
  }
}
</style>
