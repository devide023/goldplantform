import { template } from 'babel-core';
import { NULL } from 'node-sass';
<template>
  <div>
    <query-bar @query="handlequery">
      <el-button type="success" @click="add_menu" size="small" icon="el-icon-plus">新增根菜单</el-button>
      <el-button
        type="warning"
        @click="goback"
        size="small"
        icon="el-icon-arrow-up"
        :disabled="menuback.length==0"
      >返回</el-button>
    </query-bar>
    <el-table :data="list">
      <el-table-column label="状态">
        <template slot-scope="scope">{{scope.row.status|statusname}}</template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <div @click="gotopath(1,scope.row.id,scope.row.pid)" class="gotopath">{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column label="编码" prop="menucode"></el-table-column>
      <el-table-column label="路由" prop="path"></el-table-column>
      <el-table-column label="视图路径" prop="viewpath" width="300px"></el-table-column>
      <el-table-column label="类型" prop="typename.name"></el-table-column>
      <el-table-column label="图标">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.icon!=null" :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="scope.row.menutype!=='03'"
                @click.native="add_submenu(scope.row)"
              >子菜单</el-dropdown-item>
              <el-dropdown-item @click.native="edit_menu(scope.row)">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogtitle" :visible.sync="dialogshow" @opened="dialog_openedhandle">
      <el-form
        :model="form_menu"
        ref="form_menu"
        :rules="rules"
        size="small"
        label-width="80px"
        label-position="right"
      >
        <el-form-item v-if="hidefield" label="菜单名称" prop="name">
          <el-input v-model="form_menu.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item v-if="showfield" label="功能名称">
          <el-select
            v-model="form_menu.funcodes"
            placeholder="请选择功能编码"
            :multiple="true"
            clearable
            style="width:100%;"
          >
            <el-option
              v-for="item in funcode_list"
              :key="item.id"
              :label="item.name+ '('+item.code+')' "
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单编码">
          <el-input v-model="form_menu.menucode" readonly placeholder="请输入菜单编码"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menutype">
          <el-select v-model="form_menu.menutype" placeholder="请选择" style="width:100%;">
            <el-option
              v-for="item in menutypes"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="hidefield" label="菜单路由" prop="path">
          <el-input v-model="form_menu.path" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item v-if="hidefield" label="视图路径" prop="viewpath">
          <el-input v-model="form_menu.viewpath" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item v-if="hidefield" label="图标" prop="icon">
          <el-select v-model="form_menu.icon" filterable placeholder="请选择图标" style="width:100%;">
            <el-option v-for="icon in icon_list" :key="icon.id" :value="icon.name">
              <span style="float: left">{{ icon.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                <svg-icon :icon-class="icon.name" />
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogshow = false">取 消</el-button>
        <el-button type="primary" @click="submit_form_data">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QueryBar from "@/components/QueryBar/querybar";
import MenuFun from "@/api/menumgr/index";
import MenuTypeFun from "@/api/baseinfo/menutype";
import BaseinfoFun from "@/api/baseinfo/index";
export default {
  components: {
    "query-bar": QueryBar
  },
  data() {
    return {
      dialogtitle: "新增菜单",
      dialogshow: false,
      rowobj: {},
      menuback: [],
      searchdata: {
        status: "",
        pid: 0,
        key: "",
        ksrq: "",
        jsrq: ""
      },
      list: [],
      menutypes: [],
      menutypes_bak: [],
      icon_list: [],
      funcode_list: [],
      form_menu: {
        status: 1,
        name: "",
        menucode: "",
        menutype: "",
        pid: 0,
        icon: "",
        path: "",
        viewpath: "",
        funcodes: []
      },
      rules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        menutype: [
          { required: true, message: "请选择菜单类型", trigger: "blur" }
        ],
        icon: [{ required: true, message: "请选择菜单图标", trigger: "blur" }],
        path: [{ required: true, message: "请输入路由", trigger: "blur" }],
        viewpath: [
          { required: true, message: "请输入视图路径", trigger: "blur" }
        ]
      },
      recordcount: 0,
      pageindex: 1,
      pagesize: 15
    };
  },
  computed: {
    hidefield() {
      return this.rowobj.menutype === "01";
    },
    showfield() {
      return ["02", "03"].indexOf(this.rowobj.menutype) >= 0;
    }
  },
  mounted() {
    this.getmenutypelist();
    this.getlist();
  },

  methods: {
    getlist() {
      MenuFun.list({
        pid: this.searchdata.pid,
        key: this.searchdata.key,
        ksrq: this.searchdata.ksrq,
        jsrq: this.searchdata.jsrq,
        pagesize: this.pagesize
      }).then(res => {
        this.list = res.result.data;
        this.recordcount = res.result.total;
      });
    },
    getmenutypelist() {
      MenuTypeFun.menutypelist().then(res => {
        this.menutypes = res.result;
        this.menutypes_bak = res.result;
      });
    },
    geticonlist(data) {
      BaseinfoFun.iconlist().then(res => {
        this.icon_list = res.result;
      });
    },
    getfuncode_list() {
      BaseinfoFun.funcodelist().then(res => {
        this.funcode_list = res.result;
      });
    },
    handlequery(data) {},
    add_menu() {
      this.rowobj = {};
      this.form_menu.pid = 0;
      this.menutypes = this.menutypes_bak;
      this.form_menu.menutype = "";
      this.dialogshow = true;
    },
    add_submenu(row) {
      this.rowobj = row;
      this.form_menu.pid = row.id;
      this.menutypes = this.menutypes_bak;
      let newmenutypes = this.menutypes.filter(function(item) {
        return parseInt(item.code) > parseInt(row.menutype);
      });
      this.menutypes = newmenutypes;
      this.dialogtitle = "新增" + row.name + "子菜单";
      this.form_menu.menutype = "";
      this.dialogshow = true;
    },
    submit_form_data() {
      this.$refs["form_menu"].validate(v => {
        if (v) {
          MenuFun.savemenu(this.form_menu).then(res => {
            this.$message.info(res.msg);
            if (res.code === 1) {
              this.dialogshow = false;
              this.form_menu.funcodes = [];
              this.$refs["form_menu"].resetFields();
              this.getlist();
            }
          });
        } else {
          return false;
        }
      });
    },
    gotopath(e, id, pid) {
      this.menuback.push(pid);
      this.searchdata.pid = id;
      this.getlist();
    },
    goback() {
      this.searchdata.pid = this.menuback.pop();
      this.getlist();
    },
    dialog_openedhandle() {
      let d = {};
      if (Object.keys(this.rowobj).length > 0) {
        d = { id: this.rowobj.id };
      } else {
        d = { pid: 0 };
      }
      MenuFun.menucode(d).then(res => {
        this.form_menu.menucode = res.result;
      });
      this.getfuncode_list();
      this.geticonlist();
    },
    edit_menu(row) {
      this.rowobj = row;
      this.form_menu = row;
      this.dialogtitle = "编辑菜单";
      this.dialogshow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.gotopath {
  cursor: pointer;
  color: rgb(64, 158, 255);
}
</style>