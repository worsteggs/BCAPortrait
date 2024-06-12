<template>
  <div class="committee-box">
    <el-row :gutter="20">
      <el-col v-for="item in data" :key="item.name" :lg="6" :md="8" :sm="12" :xs="24" class="committee-col">
        <div>
          <img src="@/assets/contact/team-user.png" alt="" />
          <dl>
            <dt>{{item.name}}</dt>
            <dd>{{item.desc}}</dd>
            <dd><a>{{item.email}}</a></dd>
          </dl>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import img_blue from "@/assets/contact/team_blue.png";
import img_red from "@/assets/contact/team_red.png";
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: {
      type: String,
      default: "c",
    },
  },
  data () {
    return {};
  },
  computed: {
    boxClass () {
      return function (type) {
        return `${type}_bg`;
      };
    },
  },
  methods: {
    imgType () {
      const _img = type === "c" ? img_blue : img_red;
      return _img;
    },
  },
};
</script>
<style lang="scss" scoped>
body {
  background: #f7f8fa !important;
}
.committee-box {
  // max-width: 1200px;
  // width: 100%;
  // margin: 0px auto;
  // border-radius: 10px;
  // padding: 40px 30px;
  .committee-col {
    margin-bottom: 20px;
    div {
      background-repeat: no-repeat;
      background-size: 100%;
      background-color: white;
      &.c_bg {
        background-image: url("~@/assets/contact/team_blue_bg.png");
      }
      &.m_bg {
        background-image: url("~@/assets/contact/team_red_bg.png");
      }
      display: flex;
      align-items: center;
      padding: 10px;
      border-left: 6px solid #3875db;
      img {
        width: 40px;
        margin-right: 10px;
      }
      dl {
        flex: 1;
      }
      dt {
        font-size: 26px;
        color: #23255f;
        font-weight: bold;
      }
      dd {
        font-size: 14px;
        line-height: 1.5em;
        a {
          color: #3875db;
          text-decoration: underline;
        }
      }
    }
  }
}
@media only screen and (max-width: 1440px) {
  .committee-box {
    .committee-col {
      div dt {
        font-size: 22px;
      }
    }
  }
}
</style>
