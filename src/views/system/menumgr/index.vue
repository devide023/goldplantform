<template>
  <div>
    <query-bar @query="handlequery">
      <el-button type="success" @click="add_menu" icon="el-icon-plus">新增根菜单</el-button>
    </query-bar>
    <el-table :data="list">
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="编码" prop="menucode"></el-table-column>
      <el-table-column label="类型" prop="menutype"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="add_submenu(scope.row)">新增子菜单</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogtitle" :visible.sync="dialogshow">
      <el-form :model="form_menu" size="small" label-width="80px" label-position="right">
        <el-form-item label="菜单名称">
          <el-input v-model="form_menu.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单路由">
          <el-input v-model="form_menu.path" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="视图路径">
          <el-input v-model="form_menu.viewpath" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogshow = false">取 消</el-button>
        <el-button type="primary" @click="submitdata">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QueryBar from "@/components/QueryBar/querybar";
import MenuFun from "@/api/menumgr/index";
export default {
  components: {
    "query-bar": QueryBar
  },
  data() {
    return {
      dialogtitle: "新增菜单",
      dialogshow: false,
      list: [],
      form_menu: {
        name: "",
        menucode: "",
        menutype: "",
        pid: 0,
        path: "",
        viewpath: ""
      },
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
      MenuFun.list({}).then(res => {
        this.list = res.result.data;
        this.recordcount = res.result.total;
      });
    },
    handlequery(data) {},
    add_menu() {},
    add_submenu() {},
    submitdata() {}
  }
};
</script>

<style lang="scss" scoped>
</style>