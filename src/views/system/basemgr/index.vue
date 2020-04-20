<template>
  <div>
    <el-tabs v-model="activetab" type="card" @tab-click="tabClick">
      <el-tab-pane label="路由管理" name="route">
        <el-table :data="routelist">
          <el-table-column label="路径" prop="url"></el-table-column>
          <el-table-column label="请求方式" prop="method"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="功能简码" name="funcode"></el-tab-pane>
      <el-tab-pane label="菜单类型" name="menutype"></el-tab-pane>
      <el-tab-pane label="系统配置" name="config"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseFun from "@/api/baseinfo/index";
export default {
  data() {
    return {
      activetab: "route",
      list: [],
      routelist: []
    };
  },
  mounted() {
    this.getroutelist();
  },
  methods: {
    getlist() {},
    getroutelist() {
      BaseFun.routelist().then(res => {
        this.routelist = res.result;
      });
    },
    tabClick() {}
  }
};
</script>

<style lang="scss" scoped>
</style>