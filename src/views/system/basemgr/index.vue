<template>
  <div>
    <el-tabs v-model="activetab" type="card" @tab-click="tabClick">
      <el-tab-pane label="路由管理" name="route">
        <div class="btn_bar">
          <el-button type="primary" size="small" @click="fresh_route">刷新路由</el-button>
        </div>

        <el-table :data="routelist">
          <el-table-column label="路径" prop="route"></el-table-column>
          <el-table-column label="请求方式" prop="note"></el-table-column>
          <el-table-column label="操作员" prop="adduser.name"></el-table-column>
          <el-table-column label="更新日期" prop="addtime"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="功能简码" name="funcode">
        <div class="btn_bar">
          <el-button type="primary" size="small" @click="btn_addfuncode">新增功能简码</el-button>
        </div>
        <el-table :data="funcodelist">
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status===1?'success':'danger'"
              >{{scope.row.status|statusname}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="简码" prop="code"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="操作员" prop="adduser.name"></el-table-column>
          <el-table-column label="操作日期" prop="addtime"></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-setting" style="font-size:16px;"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="del_funcode(scope.row)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="菜单类型" name="menutype"></el-tab-pane>
      <el-tab-pane label="系统配置" name="config"></el-tab-pane>
    </el-tabs>

    <el-dialog :title="dialog_funcode_title" :visible.sync="dialog_funcode_show">
      <el-form :model="form_funcode" size="small" label-width="80px" label-position="right">
        <el-form-item label="功能简码">
          <el-input v-model="form_funcode.code" placeholder="请输入功能简码"></el-input>
        </el-form-item>
        <el-form-item label="功能名称">
          <el-input v-model="form_funcode.name" placeholder="请输入功能名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog_funcode_show = false">取 消</el-button>
        <el-button type="primary" @click="submit_funcode_data">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseFun from "@/api/baseinfo/index";
export default {
  data() {
    return {
      dialog_funcode_show: false,
      dialog_funcode_title: "新增功能简码",
      activetab: "route",
      list: [],
      routelist: [],
      funcodelist: [],
      form_funcode: {
        code: "",
        name: ""
      }
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
    tabClick(tab, e) {
      this.activetab = tab.name;
    },
    fresh_route() {
      BaseFun.freshroutelist().then(res => {
        this.$message.info(res.msg);
        if (res.code === 1) {
          this.getroutelist();
        }
      });
    },
    del_funcode(row) {
      BaseFun.delfuncode({ code: row.code }).then(res => {
        this.$message.info(res.msg);
        if (res.code === 1) {
          this.getfuncodelist();
        }
      });
    },
    btn_addfuncode() {
      this.dialog_funcode_show = true;
    },
    submit_funcode_data() {
      BaseFun.addfuncode(this.form_funcode).then(res => {
        this.$message.info(res.msg);
        if (res.code === 1) {
          this.getfuncodelist();
          this.dialog_funcode_show = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.btn_bar {
  margin-left: 10px;
}
</style>