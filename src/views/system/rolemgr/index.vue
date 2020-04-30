<template>
  <div>
    <query-bar @query="queryhandle">
      <template #query_btn>
        <el-button type="success" @click="add_role" size="small" icon="el-icon-plus">新增</el-button>
      </template>
    </query-bar>
    <el-table :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status===1?'success':'danger'">{{scope.row.status|statusname}}</el-tag>
        </template>
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
              <el-dropdown-item @click.native="role_menu(scope.row)">关联菜单</el-dropdown-item>
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
    <el-dialog
      :title="dialogtitle"
      :visible.sync="dialogvisiable"
      top="10px"
      :rules="rules"
      @opened="dialog_openhandle"
    >
      <el-form
        :model="formrole"
        ref="formrole"
        :rules="rules"
        label-width="80px"
        label-position="right"
        size="small"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formrole.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="关联菜单" prop="menus">
          <el-cascader
            :options="menu_options"
            :props="menu_props"
            v-model="formrole.menus"
            style="width:100%;"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="关联用户" prop="users">
          <el-select
            v-model="formrole.users"
            :multiple="true"
            :filterable="true"
            placeholder="请选择用户"
            style="width:100%;"
          >
            <el-option v-for="item in userlist" :key="item.id" :label="item.name" :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span
                style="float: right;margin-right:20px; color: #8492a6; font-size: 13px"
              >{{ item.usercode }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联路由" prop="routes">
          <el-select
            v-model="formrole.routes"
            :filterable="true"
            :multiple="true"
            :collapse-tags="true"
            placeholder="请选择路由"
            style="width:100%;"
          >
            <el-option
              v-for="item in routelist"
              :key="item.id"
              :label="item.route"
              :value="item.id"
            >
              <span style="float: left">{{ item.route }}</span>
              <span
                style="float: right;margin-right:20px; color: #8492a6; font-size: 13px"
              >{{ item.note }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formrole.note"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6}"
            placeholder="备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogvisiable = false">取消</el-button>
        <el-button type="primary" @click="submitdata">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="关联菜单"
      :visible.sync="dialog_rolemenus_show"
      top="10px"
      @opened="dialog_rolemenu_opened"
    >
      <el-tree :data="menutreedata" node-key="id" show-checkbox accordion ref="rolemenu_tree"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog_rolemenus_show = false">取消</el-button>
        <el-button type="primary" @click="save_role_menus">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QueryBar from "@/components/QueryBar/querybar";
import RoleFun from "@/api/rolemgr/index";
import BaseFun from "@/api/baseinfo/index";
import UserFun from "@/api/usermgr/index";
import MenuFun from "@/api/menumgr/index";
export default {
  components: {
    "query-bar": QueryBar
  },
  data() {
    return {
      dialogtitle: "新增角色",
      editflag: false,
      searchdata: {},
      routelist: [],
      userlist: [],
      list: [],
      selectedrows: [],
      rowobj: {},
      dialogvisiable: false,
      dialog_rolemenus_show: false,
      menutreedata: [],
      role_menus_form: {
        roleid: 0,
        menuids: []
      },
      formrole: {
        status: 1,
        menus: [],
        routes: [],
        users: [],
        name: "",
        note: ""
      },
      menu_options: [],
      menu_props: {
        multiple: true
      },
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        menus: [
          {
            type: "array",
            required: true,
            message: "请选择角色关联的菜单",
            trigger: "change"
          }
        ],
        users: [
          {
            type: "array",
            required: true,
            message: "请选择角色关联的用户",
            trigger: "change"
          }
        ],
        routes: [
          {
            type: "array",
            required: true,
            message: "请选择角色关联的路由",
            trigger: "change"
          }
        ]
      },
      recordcount: 0,
      pageindex: 1,
      pagesize: 15
    };
  },
  mounted() {
    this.getlist();
    this.getroutelist();
    this.getuserlist();
    this.getmenuoptions();
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
    getroutelist() {
      BaseFun.routelist().then(res => {
        this.routelist = res.result;
      });
    },
    getuserlist() {
      UserFun.userlist({
        pagesize: 65535
      }).then(res => {
        this.userlist = res.result.data;
      });
    },
    getmenuoptions() {
      MenuFun.all_menutree({ id: 0 }).then(res => {
        this.menu_options = res.result;
      });
    },
    queryhandle(data) {
      console.log(data);
      this.searchdata = data;
    },
    add_role() {
      this.dialogvisiable = true;
      this.editflag = false;
      this.formrole.id = 0;
      this.formrole.menus = [];
      this.formrole.routes = [];
      this.formrole.users = [];
      this.formrole.name = "";
      this.formrole.note = "";
    },
    submitdata() {
      this.$refs.formrole.validate(v => {
        if (v) {
          if (this.formrole.id > 0) {
            RoleFun.updaterole({
              id: this.formrole.id,
              name: this.formrole.name,
              note: this.formrole.note,
              menuids: this.formrole.menus,
              userids: this.formrole.users,
              routeids: this.formrole.routes,
              status: this.formrole.status
            }).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.dialogvisiable = false;
                this.getlist();
                this.$refs["formrole"].resetFields();
              }
            });
          } else {
            RoleFun.saverole({
              name: this.formrole.name,
              note: this.formrole.note,
              menuids: this.formrole.menus,
              userids: this.formrole.users,
              routeids: this.formrole.routes,
              status: this.formrole.status
            }).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.dialogvisiable = false;
                this.getlist();
                this.$refs["formrole"].resetFields();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    edit_role(row) {
      RoleFun.rolerel({
        id: row.id
      }).then(res => {
        this.editflag = true;
        this.formrole = row;
        this.rowobj = row;
        this.dialogtitle = "编辑";
        this.formrole.routes = res.result.routes.map(function(i) {
          return i.id;
        });
        this.formrole.users = res.result.users.map(function(i) {
          return i.id;
        });
        this.formrole.menus = res.menuspath;

        this.dialogvisiable = true;
      });
    },
    role_menu(row) {
      MenuFun.all_menutree({
        id: 0
      })
        .then(res => {
          this.menutreedata = res.result;
          this.role_menus_form.roleid = row.id;
          this.dialog_rolemenus_show = true;
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.selectedrows = val;
    },
    handleSizeChange(value) {
      this.pagesize = value;
    },
    handleCurrentChange(value) {
      this.pageindex = value;
    },
    dialog_openhandle() {},
    dialog_rolemenu_opened() {
      RoleFun.getrolemenus({
        id: this.role_menus_form.roleid
      }).then(res => {
        let checkeditems = res.result.map(function(i) {
          return i.id;
        });
        this.$refs.rolemenu_tree.setCheckedKeys(checkeditems);
      });
    },
    save_role_menus() {
      let menus = this.$refs.rolemenu_tree.getCheckedNodes(false, true);
      this.role_menus_form.menuids = menus.map(function(i) {
        return i.id;
      });
      RoleFun.saverolemenus({
        id: this.role_menus_form.roleid,
        menuids: this.role_menus_form.menuids
      })
        .then(res => {
          this.$message.info(res.msg);
          if (res.code === 1) {
            this.dialog_rolemenus_show = false;
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
</style>