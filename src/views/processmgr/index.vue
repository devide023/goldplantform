<template>
  <div>
    <query-bar @query="queryhandle">
      <template #query_btn>
        <el-button type="success" size="small" icon="el-icon-plus" @click="addprocess">新增</el-button>
      </template>
    </query-bar>
    <el-table :data="list">
      <el-table-column label="状态">
        <template slot-scope="scope">{{scope.row.status|statusname}}</template>
      </el-table-column>
      <el-table-column label="流程名称" prop="name"></el-table-column>
      <el-table-column label="操作人" prop="adduser.name"></el-table-column>
      <el-table-column label="操作日期" prop="addtime"></el-table-column>
      <el-table-column label="操作" width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="processedit(scope.row)">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="add_process_title" :visible.sync="dialog_show" top="10px">
      <el-form :model="processform" label-width="80px" label-position="rigth" size="small">
        <fieldset>
          <legend>基本信息</legend>
          <el-form-item label="流程名称">
            <el-input v-model="processform.name" placeholder="请输入流程名称"></el-input>
          </el-form-item>
          <el-form-item label="所属组织">
            <el-select
              v-model="processform.orgids"
              multiple
              clearable
              remote
              filterable
              :remote-method="remote_chooseorg"
              :loading="loading"
              placeholder="请选择流程所属组织"
              style="width:100%"
            >
              <el-option v-for="item in orglist" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>流程步骤</legend>
          <el-button type="text" @click="btn_add_step">添加步骤</el-button>
          <el-row v-for="(item,index) in processform.steps" :key="index">
            <el-col :lg="3" :xl="3" :sm="5">第{{index+1}}步</el-col>
            <el-col :lg="10" :xl="10" :sm="10">
              <el-input placeholder="步骤名称" v-model="item.stepname" size="small"></el-input>
            </el-col>
            <el-col :lg="9" :xl="9" :sm="6">
              <el-select
                v-model="item.userid"
                placeholder="请选择审核人员"
                size="small"
                clearable
                multiple
                filterable
                remote
                :remote-method="remote_chooseusers"
                :loading="loading"
                style="width:100%"
              >
                <el-option
                  v-for="useritem in userlist"
                  :key="useritem.id"
                  :label="useritem.name"
                  :value="useritem.id"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :lg="2" :xl="2" :sm="3">
              <el-button type="text" @click="remove_step(index)">删除</el-button>
            </el-col>
          </el-row>
        </fieldset>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog_show = false">取消</el-button>
        <el-button type="primary" @click="save_process">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QueryBar from "@/components/QueryBar/querybar";
import ProcessFn from "@/api/processmgr/index";
import UserFn from "@/api/usermgr/index";
import OrgFn from "@/api/organize/index";
export default {
  components: {
    "query-bar": QueryBar
  },
  data() {
    return {
      add_process_title: "新增流程",
      dialog_show: false,
      queryform: {},
      processform: {
        status: 1,
        name: "",
        orgids: [],
        steps: []
      },
      list: [],
      userlist: [],
      orglist: [],
      loading: false,
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
      ProcessFn.list(this.queryform).then(res => {
        this.list = res.result.data;
      });
    },
    addprocess() {
      this.dialog_show = true;
    },
    queryhandle(data) {
      this.getlist();
      this.pageindex = 1;
    },
    btn_add_step() {
      this.processform.steps.push({
        stepno: this.processform.steps.length + 1,
        stepname: "",
        userid: []
      });
    },
    remote_chooseorg(query) {
      if (query !== "") {
        this.loading = true;
        OrgFn.list({
          pagesize: 65535,
          name: query
        }).then(res => {
          this.orglist = res.result.data.map(function(i) {
            return { id: i.id, name: i.name };
          });
          this.loading = false;
        });
      }
    },
    remote_chooseusers(search) {
      if (search !== "") {
        this.loading = true;
        UserFn.userlist({
          pagesize: 65535,
          key: search
        }).then(res => {
          this.userlist = res.result.data.map(function(i) {
            return { id: i.id, name: i.name };
          });
          this.loading = false;
        });
      }
    },
    remove_step(index) {
      this.processform.steps.splice(index, 1);
    },
    save_process() {
      ProcessFn.addprocess(this.processform).then(res => {});
    }
  }
};
</script>

<style lang="scss" scoped>
</style>