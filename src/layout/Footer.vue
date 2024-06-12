<template>
  <div class="footer-wrap">
    <!-- <div style="text-align: center;">
      <p class="footer-title">BrainCellAtlas</p>
      <ul class="footer-menus wrap">
        <template v-for="item in menus">
          <template v-if="item.children && item.children.length > 0">
            <li v-for="value in item.children" :key="value.path">
              <router-link :to="value.path" v-if="!item.hidden">
                {{ value.meta.title }}
              </router-link>
            </li>
          </template>
          <template v-else>
            <li :key="item.path" v-if="!item.hidden">
              <router-link :to="item.path">{{ item.meta.title }}</router-link>
            </li>
          </template>
        </template>
      </ul>
    </div> -->
    <div class="footer-copy ">
      <el-row :gutters="24" class="wrap">
        <el-col :span="8">
          <p style="margin-top: 7px;">BrainCellAtlas © 2023</p>
          <p>Created by <a href="https://www.rnacentre.org/">Miao Lab</a> @ Guangzhou Laboratory</p>
        </el-col>
        <el-col :span="8">
          <div><img src="@/assets/img/footer-funding.png" alt="" width="14px"> Funding:</div>
          <p><a href="https://www.nsfc.gov.cn/">NSFC</a></p>
          <p><a href="https://www.most.gov.cn/index.html">MOST IT+BT project</a></p>
          <p>GZlab Starting Grant</p>
        </el-col>
        <el-col :span="8">
          <div><img src="@/assets/img/footer-contact.png" alt="" width="14px"> Contact:</div>
          <p>Building B2, Guangzhou Laboratory <a href='https://www.google.com/maps/place/%E5%B9%BF%E5%B7%9E%E7%94%9F%E7%89%A9%E5%B2%9B%E5%9B%BD%E9%99%85%E5%85%AC%E5%AF%93/@23.0618989,113.3728525,17z/data=!4m6!3m5!1s0x34025549978de655:0xbfef76e0d9d7b9!8m2!3d23.0618989!4d113.3750261!16s%2Fg%2F11hb7hwpjs?hl=en&entry=ttu'>(Maps)</a></p>
          <p>96 Xingdao South Road, Guangzhou International Bio Island, Haizhu District,
            Guangzhou, Guangdong, China
          </p>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      menus: [],
    };
  },
  created () {
    const routes = require("@/router").routes.find((v) => v.name === "layout");
    this.menus = routes.children ?? [];
  },
};
</script>
<style lang="scss" scoped>
.footer-wrap {
  background: #23265f;
  color: white;

  padding: 0 0 0;
  .footer-title {
    // color: $themeColor;
    font-size: 18px;
    font-weight: bold;
  }
  .footer-menus {
    display: flex;
    flex-wrap: wrap;
    padding: 30px 0;
    justify-content: space-between;
    font-size: 16px;
    font-family: Alibaba PuHuiTi 2-65 Medium, Alibaba PuHuiTi 20;
    li {
      min-width: 90px;
    }
    a {
      color: white;
    }
  }
  .footer-copy {
    font-size: 14px;
    background: #f4f3f9;
    padding: 2px 0;
    div {
      // color: #807e97;
      color: #333;
      font-size: 18px;
      img {
        margin-right: 10px;
      }
    }
    p {
      margin-top: 1px;
      // color: white;
      font-size: 14px;
    }
    a {
      color: #034cca;
      text-decoration: underline;
    }
  }
}
</style>
