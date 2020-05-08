<template>
  <div>
    <el-table :data="list">
      <el-table-column label></el-table-column>
    </el-table>
    <el-pagination
      :total="recordcount"
      :current-page="pageindex"
      :page-size="pagesize"
      :page-sizes="[15,30,50, 100, 200]"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange"
      background
      style="text-align:right;"
    ></el-pagination>
  </div>
</template>

<script>
import RepairFn from "@/api/repair/index";
export default {
  data() {
    return {
      list: [],
      recordcount: 0,
      pageindex: 1,
      pagesize: 15
    };
  },
  methods: {
    getlist() {
      RepairFn.list({}).then(res => {
        this.list = res.result.data;
        this.recordcount = res.result.total;
      });
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getlist();
    },
    handleCurrentChange(index) {
      this.pageindex = index;
      this.getlist();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>