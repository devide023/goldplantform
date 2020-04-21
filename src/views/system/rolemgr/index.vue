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
              <el-dropdown-item @click.native="role_menu(scope.row)">菜单</el-dropdown-item>
              <el-dropdown-item @click.native="role_user(scope.row)">用户</el-dropdown-item>
              <el-dropdown-item @click.native="role_route(scope.row)">路由</el-dropdown-item>
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
    <el-dialog :title="dialogtitle" :visible.sync="dialogvisiable" top="10px" :rules="rules">
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
        <el-form-item label="关联菜单">
          <el-cascader :props="menu_props" v-model="formrole.menus" :show-all-levels="false"></el-cascader>
        </el-form-item>
        <el-form-item label="关联用户" prop="users">
          <el-select
            v-model="formrole.users"
            :multiple="true"
            :filterable="true"
            placeholder="请选择用户"
            style="width:100%;"
          >
            <el-option
              v-for="(item,index) in userlist"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
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
              v-for="(item,index) in routelist"
              :key="index"
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
        <el-button @click="dialogvisiable = false">取 消</el-button>
        <el-button type="primary" @click="submitdata">确 定</el-button>
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
      searchdata: {},
      routelist: [],
      userlist: [],
      list: [],
      selectedrows: [],
      dialogvisiable: false,
      formrole: {
        status: 1,
        menus: [],
        routes: [],
        users: [],
        name: "",
        note: ""
      },
      menu_props: {
        lazy: true,
        multiple: true,
        lazyLoad(node, resolve) {
          let pid = 0;
          if (node.level !== 0) {
            pid = node.value;
          }
          MenuFun.list({ pid: pid, pagesize: 65535 }).then(res => {
            let nodes = res.result.data.filter(function(i) {
              return ["01", "02"].indexOf(i.menutype) >= 0;
            });
            let d = nodes.map(function(i) {
              let t = { label: i.name, value: i.id };
              if (i.menutype === "02") {
                t.leaf = true;
              }
              return t;
            });
            resolve(d);
          });
        }
      },
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
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
    queryhandle(data) {
      console.log(data);
      this.searchdata = data;
    },
    add_role() {
      this.dialogvisiable = true;
    },
    submitdata() {
      this.$refs.formrole.validate(v => {
        console.log(v);
        if (v) {
          RoleFun.saverole({
            name: this.formrole.name,
            note: this.formrole.note,
            userids: this.formrole.users,
            routeids: this.formrole.routes,
            status: this.formrole.status
          }).then(res => {
            this.$message.info(res.msg);
            if (res.code === 1) {
              this.getlist();
              this.$refs["formrole"].resetFields();
            }
          });
        } else {
          return false;
        }
      });
    },
    edit_role(row) {
      this.formrole = row;
      this.dialogtitle = "编辑";
      this.dialogvisiable = true;
    },
    role_menu(row) {},
    role_user(row) {},
    role_route(row) {},
    handleSelectionChange(val) {
      this.selectedrows = val;
    },
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