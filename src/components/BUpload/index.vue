<template>
  <div>
    <div class="upload-box">
      <input
        readonly
        type="text"
        placeholder="No file selected"
        class="upload-input"
        @click="upload"
      />
      <b-button @click="upload" class="upload-button" style="margin-right: 0">
        <img src="@/assets/img/upload.png" alt="" width="18" />&nbsp;Browse
      </b-button>
    </div>
    <input
      type="file"
      v-show="false"
      @change="uploadChange"
      ref="uploadInput"
    />
  </div>
</template>
<script>
export default {
  name: "BUpload",
  methods: {
    uploadChange(e) {
      
    },
    upload() {
      this.$refs.uploadInput.click();
    },
  },
};
</script>
<style lang="scss" scoped>
.upload-box {
  background: #f5f7fa;
  width: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  .upload-input {
    border: none;
    height: 100%;
    background: none;
    flex: 1;
    padding: 4px 10px;
    width: 224px;
  }
  .upload-button {
    display: flex;
    align-items: center;
  }
}
</style>
