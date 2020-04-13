<template>
  <div>
    <query-bar @query="querydata">
      <template>
        <el-button
          size="small"
          type="success"
          icon="el-icon-plus"
          v-has="{fun:'add'}"
          @click="AddUser()"
        >新增</el-button>
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

    <el-dialog :title="formtitle" :visible.sync="dialogVisible">
      <el-form :model="userform" class size="small" label-position="right">
        <el-form-item label="用户编码" label-width="70px">
          <el-input v-model="userform.usercode"></el-input>
        </el-form-item>
        <el-form-item label="用户名" label-width="70px">
          <el-input v-model="userform.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" label-width="70px">
          <el-radio-group v-model="userform.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="登录密码" label-width="70px">
          <el-input type="password" v-model="userform.userpwd"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" label-width="70px">
          <el-input type="text" v-model="userform.idno"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="70px">
          <el-input type="tel" v-model="userform.tel"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址" label-width="70px">
          <el-input type="email" v-model="userform.email"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" label-width="70px">
          <el-input type="textarea" autosize="{ minRows: 3, maxRows: 5}" v-model="userform.adress"></el-input>
        </el-form-item>
        <el-form-item label="用户头像" label-width="70px">
          <el-upload show-file-list="false" multiple="false">
            <el-button size="mini" type="primary" icon="el-icon-upload">上传图片</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
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
      formtitle: "新增用户",
      dialogVisible: false,
      list: [],
      userform: {
        sex: 1,
        status: 1,
        usercode: "",
        name: "",
        idno: "",
        tel: "",
        email: "",
        adress: ""
      },
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
    AddUser() {
      this.dialogVisible = true;
    },
    handleSelectionChange() {},
    handleCurrentChange() {},
    handleSizeChange() {}
  }
};
</script>

<style lang="scss" scoped>
</style>