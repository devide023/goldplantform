import { TRUE } from 'node-sass';
import organize from '../../../api/organize';
<template>
  <div>
    <query-bar @query="querydata">
      <template #query_btn>
        <el-button
          size="small"
          type="success"
          icon="el-icon-plus"
          v-has="{fun:'add'}"
          @click="AddUser()"
        >新增</el-button>
        <el-button size="small" type="danger" @click="disable_user">禁用</el-button>
        <el-button size="small" type="warning" @click="enable_user">启用</el-button>
      </template>
    </query-bar>
    <el-table :data="list" @selection-change="handleSelectionChange">
      >
      <el-table-column type="selection" width="55" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" width="70">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status===1?'success':'danger'">{{scope.row.status|statusname}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="代号" prop="usercode" width="80"></el-table-column>
      <el-table-column label="姓名" prop="name" width="80"></el-table-column>
      <el-table-column label="性别" width="50">
        <template slot-scope="scope">{{ scope.row.sex===1?"男":"女" }}</template>
      </el-table-column>
      <el-table-column label="出生日期" width="100" prop="birthdate"></el-table-column>
      <el-table-column label="电话" prop="tel" width="150"></el-table-column>
      <el-table-column label="身份证" prop="idno" width="165"></el-table-column>
      <el-table-column label="邮箱" prop="email" width="150"></el-table-column>
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
              <el-dropdown-item @click.native="userrole(scope.row)">关联角色</el-dropdown-item>
              <el-dropdown-item @click.native="userorg(scope.row)">关联组织节点</el-dropdown-item>
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
      :title="formtitle"
      :visible.sync="dialogVisible"
      top="10px"
      @closed="dialog_user_closed"
    >
      <el-form
        :model="userform"
        ref="userform"
        :rules="rules"
        label-width="90px"
        size="small"
        label-position="right"
      >
        <el-form-item label="用户编码" prop="usercode">
          <el-input v-model="userform.usercode"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userform.username"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="userform.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!editflag" label="登录密码" prop="password">
          <el-input type="password" v-model="userform.password"></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker
            v-model="userform.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="出生日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input type="text" v-model="userform.idno"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input type="tel" v-model="userform.tel"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input type="email" v-model="userform.email"></el-input>
        </el-form-item>
        <el-form-item label="联系地址" prop="provinces">
          <el-cascader
            v-model="userform.provinces"
            :props="city_props"
            :show-all-levels="true"
            @change="choosed_province"
            placeholder="请选择省市区"
            ref="ddl_province"
          ></el-cascader>
          <el-input type="text" v-model="userform.adress" placeholder="街道门牌" style="width:65%"></el-input>
        </el-form-item>
        <el-form-item label="用户头像">
          <el-upload
            class="avatar-uploader"
            :headers="headers"
            :action="upload_headimg_path"
            :show-file-list="false"
            :multiple="false"
            accept="image/png, image/jpeg"
            :on-success="imgupload_success"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="headerUrl.length>0" :src="headerUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveuserinfo">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="关联角色" :visible.sync="dialog_userrole" top="10px">
      <el-form :model="user_role_form" label-width="80px" label-position="right" size="small">
        <el-checkbox-group v-model="user_role_form.roleids">
          <el-checkbox v-for="item in rolelist" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog_userrole = false">取消</el-button>
        <el-button type="primary" @click="save_user_role">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="关联组织节点"
      :visible.sync="dialog_userorg_show"
      @opened="load_user_org"
      top="10px"
    >
      <el-tree :data="orgtree" :show-checkbox="true" default-expand-all node-key="id" ref="orgtree"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog_userorg_show = false">取消</el-button>
        <el-button type="primary" @click="save_user_orgnodes">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QueryBar from "@/components/QueryBar/querybar.vue";
import UserFun from "@/api/usermgr/index";
import OrgFun from "@/api/organize/index";
import ProvinceFun from "@/api/utils/province";
import { getToken } from "@/utils/auth";
import Tool from "@/api/utils/tool";
import RoleFun from "@/api/rolemgr/index";
export default {
  components: {
    "query-bar": QueryBar
  },
  data() {
    return {
      formtitle: "新增用户",
      dialog_userrole: false,
      dialogVisible: false,
      dialog_userorg_show: false,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + getToken()
      },
      upload_headimg_path: UserFun.head_image_path,
      headerUrl: "",
      orgtree: [],
      editflag: false,
      selectedrows: [],
      list: [],
      rolelist: [],
      searchdata: {},
      user_role_form: {
        id: 0,
        roleids: []
      },
      user_org_form: {
        id: 0,
        orgnodes: []
      },
      userform: {
        sex: 1,
        status: 1,
        usercode: "",
        username: "",
        password: "",
        birthday: "",
        idno: "",
        tel: "",
        email: "",
        adress: "",
        headimg: "",
        province: 0,
        city: 0,
        district: 0,
        provinces: []
      },

      city_props: {
        lazy: true,
        multiple: false,
        lazyLoad(node, resolve) {
          let id = -1;
          if (node.level !== 0) {
            id = node.value;
          }
          ProvinceFun.province(id).then(res => {
            let nodes = res.result.data.map(function(i) {
              let retitem = {
                value: i.id,
                label: i.name
              };
              if (node.level >= 2) {
                retitem.leaf = true;
              }
              return retitem;
            });
            resolve(nodes);
          });
        }
      },
      rules: {
        usercode: [
          { required: true, message: "请输入用户编码", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        provinces: [
          {
            type: "array",
            required: true,
            message: "请选择地区",
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
    this.getrolelist();
  },
  methods: {
    querydata(data) {
      this.searchdata = data;
      this.getlist();
      this.pageindex = 1;
    },
    getlist() {
      UserFun.userlist({
        key: this.searchdata.key,
        ksrq: this.searchdata.ksrq,
        jsrq: this.searchdata.jsrq,
        page: this.pageindex,
        pagesize: this.pagesize
      }).then(res => {
        this.list = res.result.data;
        this.recordcount = res.result.total;
      });
    },
    getrolelist() {
      RoleFun.list({
        pagesize: 65535
      })
        .then(res => {
          this.rolelist = res.result.data;
        })
        .catch(() => {});
    },
    AddUser() {
      this.userform.usercode = "";
      this.userform.username = "";
      this.userform.password = "";
      this.userform.idno = "";
      this.userform.birthday = "";
      this.userform.tel = "";
      this.userform.email = "";
      this.userform.adress = "";
      this.userform.province = 0;
      this.userform.city = 0;
      this.userform.district = 0;
      this.userform.orgids = [];
      this.userform.provinces = [];
      this.headerUrl = "";
      this.editflag = false;
      this.dialogVisible = true;
    },
    saveuserinfo() {
      this.$refs["userform"].validate(v => {
        if (v) {
          if (this.userform.id > 0) {
            UserFun.edit(this.userform).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.dialogVisible = false;
                this.$refs["userform"].resetFields();
                this.getlist();
              }
            });
          } else {
            UserFun.add(this.userform).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.$refs["userform"].resetFields();
                this.dialogVisible = false;
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    useredit(user) {
      UserFun.find({ id: user.id })
        .then(res => {
          this.userform = res.result;
          this.userform.username = res.result.name;
          this.userform.birthday = res.result.birthdate;
          this.headerUrl = Tool.baseurl + "/storage/" + res.result.headimg;
          this.formtitle = "编辑用户";
          this.editflag = true;
          this.dialogVisible = true;
          if (
            res.result.province !== 0 &&
            res.result.city !== 0 &&
            res.result.district
          ) {
            this.userform.provinces = [
              res.result.province,
              res.result.city,
              res.result.district
            ];
          }
        })
        .catch(() => {});
    },
    handleSelectionChange(rows) {
      this.selectedrows = rows;
    },
    handleCurrentChange(index) {
      this.pageindex = index;
      this.getlist();
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getlist();
    },
    selected_org(n) {
      this.userform.orgids = n;
    },
    choosed_province(value) {
      if (value.length >= 3) {
        this.userform.province = value[0];
        this.userform.city = value[1];
        this.userform.district = value[2];
      }
    },
    disable_user() {
      this.$confirm("你确定要禁用所选项目?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ids = this.selectedrows.map(function(i) {
            return i.id;
          });
          UserFun.disabel({
            ids: ids
          }).then(res => {
            this.$message.info(res.msg);
            if (res.code === 1) {
              this.getlist();
            }
          });
        })
        .catch(() => {});
    },
    enable_user() {
      let ids = this.selectedrows.map(function(i) {
        return i.id;
      });
      UserFun.enabel({
        ids: ids
      }).then(res => {
        this.$message.info(res.msg);
        if (res.code === 1) {
          this.getlist();
        }
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = ["image/jpeg", "image/png"].indexOf(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (isJPG < 0) {
        this.$message.error("上传头像图片只能是 JPG|PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG >= 0 && isLt2M;
    },
    imgupload_success(res, file, fileList) {
      this.$message.info(res.msg);
      this.headerUrl = res.filepath;
      this.userform.headimg = res.filename;
    },
    userrole(row) {
      UserFun.getuserroles({
        id: row.id
      }).then(res => {
        this.user_role_form.id = row.id;
        this.user_role_form.roleids = res.result.map(function(i) {
          return i.id;
        });
        this.dialog_userrole = true;
      });
    },
    userorg(row) {
      OrgFun.all_tree_nodes({
        id: 0
      })
        .then(res => {
          this.user_org_form.id = row.id;
          this.orgtree = res.result;
          this.dialog_userorg_show = true;
        })
        .catch(() => {});
    },
    load_user_org() {
      UserFun.getuserorgs({ id: this.user_org_form.id })
        .then(res => {
          console.log(res);
          let checkednodes = res.result.map(function(i) {
            return i.id;
          });
          this.$refs.orgtree.setCheckedKeys(checkednodes);
        })
        .catch(() => {});
    },
    save_user_role() {
      UserFun.saverole({
        id: this.user_role_form.id,
        roleids: this.user_role_form.roleids
      }).then(res => {
        this.$message.info(res.msg);
        if (res.code === 1) {
          this.dialog_userrole = false;
          this.getrolelist();
        }
      });
    },
    save_user_orgnodes() {
      let nodes = this.$refs.orgtree.getCheckedNodes();
      this.user_org_form.orgnodes = nodes;
      UserFun.saveorgnodes(this.user_org_form).then(res => {
        this.$message.info(res.msg);
        if (res.code === 1) {
          this.dialog_userorg_show = false;
        }
      });
    },
    dialog_user_closed() {
      this.$refs["userform"].resetFields();
    }
  }
};
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>