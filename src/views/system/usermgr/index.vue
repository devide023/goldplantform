<template>
  <div>
    <query-bar @query="querydata">
      <template>
        <el-button size="small" type="warning">禁用</el-button>
      </template>
    </query-bar>
    <el-table :data="list" @selection-change="handleSelectionChange">
      >
      <el-table-column type="selection" width="55" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" width="70" prop="status"></el-table-column>
      <el-table-column label="代号" prop="usercode" width="80"></el-table-column>
      <el-table-column label="姓名" prop="name" width="150"></el-table-column>
      <el-table-column label="性别" width="80">
        <template slot-scope="scope">{{ scope.row.sex===1?"男":"女" }}</template>
      </el-table-column>
      <el-table-column label="出生日期" width="150" prop="birthdate"></el-table-column>
      <el-table-column label="电话" prop="tel" width="150"></el-table-column>
      <el-table-column label="地址" prop="adress"></el-table-column>
      <el-table-column label="录入日期" prop="addtime" width="100"></el-table-column>
      <el-table-column label="操作" width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-has="{fun:'edit'}" @click.native="useredit(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item v-has="{fun:'userrole'}" @click.native="userrole(scope.row)">角色</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="recordcount"
      :current-page="pageindex"
      :page-size="pagesize"
      :page-sizes="[20, 50, 100, 200]"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
import QueryBar from "@/components/QueryBar/querybar.vue";
import UserFun from "@/api/usermgr/index";
export default {
  components: {
    "query-bar": QueryBar
  },
  data() {
    return {
      list: [],
      recordcount: 0,
      pageindex: 1,
      pagesize: 50
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    querydata(data) {
      console.log(data);
    },
    getlist() {
      UserFun.userlist().then(res => {
        this.list = res.result.data;
      });
    },
    handleSelectionChange() {},
    handleCurrentChange() {},
    handleSizeChange() {}
  }
};
</script>

<style lang="scss" scoped>
</style>