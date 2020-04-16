<template>
  <div>
    <query-bar @query="queryhandle">
      <slot>
        <el-button type="success" @click="add_role" size="small" icon="el-icon-plus">新增</el-button>
      </slot>
    </query-bar>
    <el-table :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" width="100px">
        <template slot-scope="scope">{{scope.row.status|statusname}}</template>
      </el-table-column>
      <el-table-column label="名称" prop="name" width="200px"></el-table-column>
      <el-table-column label="备注" prop="note" width="300px"></el-table-column>
      <el-table-column label="操作人" prop="adduser.name" width="200px"></el-table-column>
      <el-table-column label="操作日期" prop="addtime" width="200px"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="edit_role(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="role_user(scope.row)">角色用户</el-dropdown-item>
              <el-dropdown-item @click.native="role_route(scope.row)">角色路由</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
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
    <el-dialog :title="dialogtitle" :visible.sync="dialogvisiable" top="10px">
      <el-form :model="formrole" label-width="80px" label-position="right" size="small">
        <el-form-item label="角色名称">
          <el-input v-model="formrole.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formrole.note"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 10}"
            placeholder="备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogvisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitdata">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QueryBar from "@/components/QueryBar/querybar";
import RoleFun from "@/api/rolemgr/index";
export default {
  components: {
    "query-bar": QueryBar
  },
  data() {
    return {
      dialogtitle: "新增角色",
      searchdata: {},
      list: [],
      dialogvisiable: false,
      formrole: {},
      recordcount: 0,
      pageindex: 1,
      pagesize: 15
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    getlist() {
      RoleFun.list({
        page: this.pageindex,
        pagesize: this.pagesize
      }).then(res => {
        this.list = res.result.data;
        this.recordcount = res.result.total;
      });
    },
    queryhandle(data) {
      console.log(data);
      this.searchdata = data;
    },
    add_role() {
      this.dialogvisiable = true;
    },
    submitdata() {},
    edit_role() {},
    role_user() {},
    role_route() {},
    handleSelectionChange() {},
    handleSizeChange(value) {
      this.pagesize = value;
    },
    handleCurrentChange(value) {
      this.pageindex = value;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>