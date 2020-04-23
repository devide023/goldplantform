<template>
  <div>
    <query-bar @query="handlequery">
      <template #query_btn>
        <el-button type="success" @click="add_menu" size="small" icon="el-icon-plus">根菜单</el-button>
        <el-button type="danger" size="small" @click="disable_item">禁用</el-button>
        <el-button type="primary" size="small" @click="enable_item">启用</el-button>
        <el-button
          type="warning"
          @click="goback"
          size="small"
          icon="el-icon-arrow-up"
          :disabled="menuback.length==0"
        >返回</el-button>
      </template>
    </query-bar>
    <el-table :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status===1?'success':'danger'">{{scope.row.status|statusname}}</el-tag>
        </template>
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
                v-if="scope.row.menutype==='01'"
                @click.native="add_submenu(scope.row)"
              >子菜单</el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.menutype==='02'"
                @click.native="add_pagefun(scope.row)"
              >功能菜单</el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.menutype ==='01'"
                @click.native="edit_menu(scope.row)"
              >编辑</el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.menutype ==='02'"
                @click.native="edit_pagefun(scope.row)"
              >编辑</el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.menutype ==='03'"
                @click.native="del_menu(scope.row)"
              >删除</el-dropdown-item>
              <el-dropdown-item @click.native="menu_role(scope.row)">关联角色</el-dropdown-item>
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
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form_menu.name" placeholder="请输入菜单名称"></el-input>
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
        <el-form-item label="菜单路由" prop="path">
          <el-input v-model="form_menu.path" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="视图路径" prop="viewpath">
          <el-input v-model="form_menu.viewpath" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
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
    <!--功能菜单dialog-->
    <el-dialog :title="dialog_fun" :visible.sync="dialog_funshow" @opened="dialog_funopen_handle">
      <el-form
        :model="form_menu"
        ref="form_menu"
        :rules="rules"
        size="small"
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="功能简码" prop="funcodes">
          <el-select
            v-model="form_menu.funcodes"
            placeholder="请选择功能编码"
            :multiple="true"
            clearable
            style="width:100%;"
          >
            <el-option
              v-for="(item,index) in funcode_list"
              :key="index"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog_funshow = false">取 消</el-button>
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
      dialogtitle: "新增根菜单",
      dialog_fun: "新增页面功能",
      dialogshow: false,
      dialog_funshow: false,
      editflag: false,
      rowobj: {},
      multipleSelection: [],
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
        funcodes: [
          {
            type: "array",
            required: true,
            message: "请选择功能简码",
            trigger: "change"
          }
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
      this.editflag = false;
      this.rowobj = {};
      this.form_menu.pid = 0;
      this.menutypes = this.menutypes_bak;
      this.form_menu.menutype = "";
      this.dialogshow = true;
    },
    add_submenu(row) {
      this.editflag = false;
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
          if (this.editflag) {
            MenuFun.editmenu(this.form_menu).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.dialogshow = false;
                this.dialog_funshow = false;
                this.form_menu.funcodes = [];
                this.getlist();
              }
            });
          } else {
            MenuFun.savemenu(this.form_menu).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.dialogshow = false;
                this.dialog_funshow = false;
                this.form_menu.funcodes = [];
                this.$refs["form_menu"].resetFields();
                this.getlist();
              }
            });
          }
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
      if (!this.editflag) {
        let d = {};
        if (Object.keys(this.rowobj).length > 0) {
          d = { id: this.rowobj.id };
        } else {
          d = { pid: 0 };
        }
        MenuFun.menucode(d).then(res => {
          this.form_menu.menucode = res.result;
        });
      }
      this.geticonlist();
    },
    dialog_funopen_handle() {
      this.getfuncode_list();
      if (!this.editflag) {
        let d = {};
        if (Object.keys(this.rowobj).length > 0) {
          d = { id: this.rowobj.id };
        } else {
          d = { pid: 0 };
        }
        MenuFun.menucode(d).then(res => {
          this.form_menu.menucode = res.result;
        });
      } else {
        MenuFun.pagefuncodes({
          id: this.rowobj.id
        }).then(res => {
          this.form_menu.funcodes = res.result.map(function(i) {
            return i.code;
          });
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    disable_item() {
      if (this.multipleSelection.length > 0) {
        let ids = [];
        this.multipleSelection.forEach(function(i) {
          ids.push(i.id);
        });
        MenuFun.disableitem({ ids: ids }).then(res => {
          this.$message.success(res.msg);
          if (res.code === 1) {
            this.getlist();
          }
        });
      } else {
        this.$message.info("请选择项目");
      }
    },
    enable_item() {
      if (this.multipleSelection.length > 0) {
        let ids = [];
        this.multipleSelection.forEach(function(i) {
          ids.push(i.id);
        });
        MenuFun.enableitem({ ids: ids }).then(res => {
          this.$message.success(res.msg);
          if (res.code === 1) {
            this.getlist();
          }
        });
      } else {
        this.$message.info("请选择项目");
      }
    },
    edit_menu(row) {
      this.rowobj = row;
      this.form_menu = row;
      this.editflag = true;
      this.dialogtitle = "编辑菜单";

      this.dialogshow = true;
    },
    del_menu(row) {
      this.rowobj = row;
      this.$confirm("你确定要永久删除该项?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        MenuFun.removemenu({ id: row.id }).then(res => {
          this.$message.info(res.msg);
          this.getlist();
        });
      });
    },
    add_pagefun(row) {
      this.rowobj = row;
      this.form_menu.pid = row.id;
      this.form_menu.menutype = "03";
      this.editflag = false;
      this.dialog_funshow = true;
    },
    edit_pagefun(row) {
      this.rowobj = row;
      this.form_menu.menucode = row.menucode;
      this.form_menu.pid = row.pid;
      this.form_menu.menutype = row.menutype;
      this.form_menu.status = 1;
      this.dialog_fun = "编辑页面功能";
      this.editflag = true;
      this.dialog_funshow = true;
    },
    menu_role(row) {}
  }
};
</script>

<style lang="scss" scoped>
.gotopath {
  cursor: pointer;
  color: rgb(64, 158, 255);
}
</style>