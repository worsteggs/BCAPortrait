<template>
  <div class="wrap">
    <div class="contact-wrap">
      <teamItem :data="lists" type="m" />
      <div class="f">
          <p>For any inquiries or concerns regarding the database, please reach out to us.</p>
        </div>
      <el-divider></el-divider>
      <div class="mtit">
        <div class="t">Reference</div>
        <div class="f">
          <p>BrainCellAtlas: a large-scale single-cell atlas of integrative human brain regions (2023) Xinyue Chen, Ziliang Huang, Yin Huang, Lahong Xu, Mingli Ye, Renke You, Xuegong Zhang, Zhichao Miao*</p>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="mtit">
        <div class="t">Acknowledgements</div>
        <div class="f">
          <p>We thank Yifan Yang and Jie Tao for the data collection. We thank the authors of related datasets who kindly provided metadata of their studies.</p>
        </div>
      </div>
    </div>
    <div style="height: 30px"></div>
  </div>
</template>
<script>
export default {
  components: {
    teamItem: () => import("./components/teamItem.vue"),
  },
  data () {
    return {
      lists: [{
        name: "Xinyue Chen",
        img: require("@/assets/img/xiaoxiao.png"),
        desc: "PhD Candidate",
        email: "chen_xinyue@gzlab.ac.cn"
      }, {
        name: "Ziliang Huang",
        img: require("@/assets/img/xiaoxiao.png"),
        desc: "Research Assistant",
        email: "huang_ziliang@gzlab.ac.cn"
      // }, {
      //   name: "Dr Yin Huang",
      //   img: require("@/assets/img/xiaoxiao.png"),
      //   desc: "Postdoc",
      //   email: "huang_yin@gzlab.ac.cn"
      // }, {
      //   name: "Dr Lahong Xu",
      //   img: require("@/assets/img/xiaoxiao.png"),
      //   desc: "Postdoc",
      //   email: "xu_lahong@gzlab.ac.cn"
      // }, {
      //   name: "Prof Zhichao Miao",
      //   img: require("@/assets/img/xiaoxiao.png"),
      //   desc: "Principle Investigator",
      //   email: "miao_zhichao@gzlab.ac.cn"
      }],
    };
  },
};
</script>
<style lang="scss" scoped>
.contact-wrap {
  margin-top: 60px;
}
.mtit {
  .t {
    font-size: 24px;
    line-height: 62px;
  }
  .f p {
    padding-top: 22px;
  }
}
</style>
