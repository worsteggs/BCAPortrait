// 入口
<template>
  <div align="center" class="entry-wrap">
    <div class="logo"><i>CB</i>RAIN <i>C</i>ELL <i>A</i>TLAS.org</div>
    <el-row :gutters="24" class="brain-row">
      <el-col :md="12" :xs="24">
        <router-link to="/index" class="brain-cell">
          <brain-img-wrap label="HUMAN BRAIN">
            <img src="@/assets/img/human-brain.png" alt="HUMAN BRAIN" />
          </brain-img-wrap>
        </router-link>
      </el-col>
      <el-col :md="12" :sm="24">
        <router-link to="/" class="brain-cell">
          <brain-img-wrap label="ANIMAL BRAIN">
            <img src="@/assets/img/animal-brain.png" alt="ANIMAL BRAIN" />
          </brain-img-wrap>
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
.entry-wrap {
  width: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
@media screen and (max-width: 1000px) {
  .entry-wrap {
    position: static;
    transform: translate(0, 0);
  }
}
.logo {
  color: $logoColor;
  font-size: 33px;
  font-weight: 600;
  i {
    font-size: 64px;
    font-style: normal;
  }
}
.brain-row {
  margin-top: 150px;
  width: 100%;
  max-width: 1200px;
  .brain-cell {
    display: inline-block;
    padding: 26px 0;
    margin-bottom: 20px;
  }
}
</style>
