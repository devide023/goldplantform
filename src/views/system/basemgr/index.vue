<template>
  <div>
    <el-tabs v-model="activetab" type="card" @tab-click="tabClick">
      <el-tab-pane label="路由管理" name="route">
        <div>
          <el-button type="primary" @click="fresh_route"></el-button>
        </div>

        <el-table :data="routelist">
          <el-table-column label="路径" prop="route"></el-table-column>
          <el-table-column label="请求方式" prop="note"></el-table-column>
          <el-table-column label="操作员" prop="adduser.name"></el-table-column>
          <el-table-column label="更新日期" prop="addtime"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="功能简码" name="funcode">
        <el-table :data="funcodelist">
          <el-table-column label="状态" prop="status"></el-table-column>
          <el-table-column label="简码" prop="code"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="操作员" prop="adduser.name"></el-table-column>
          <el-table-column label="操作日期" prop="addtime"></el-table-column>
        </el-table>
      </el-tab-pane>
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
      routelist: [],
      funcodelist: []
    };
  },
  mounted() {
    this.getroutelist();
    this.getfuncodelist();
  },
  methods: {
    getlist() {},
    getroutelist() {
      BaseFun.routelist().then(res => {
        this.routelist = res.result;
      });
    },
    getfuncodelist() {
      BaseFun.funcodelist().then(res => {
        this.funcodelist = res.result;
      });
    },
    tabClick() {},
    fresh_route() {
      BaseFun.freshroutelist().then(res => {
        this.$message.info(res.msg);
        if (res.code === 1) {
          this.getroutelist();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>