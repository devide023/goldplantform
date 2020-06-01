import index from 'vuex';
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
              <el-dropdown-item @click.native="viewprocess(scope.row)">查看</el-dropdown-item>
              <el-dropdown-item @click.native="processedit(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="processremove(scope.row)">删除</el-dropdown-item>
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

    <el-dialog title="流程查看" top="10px" :visible.sync="dialog_view_show">
      <fieldset>
        <legend>基本信息</legend>
        <el-row class="rowitem">
          <el-col :lg="3">
            <label>流程名称</label>
          </el-col>
          <el-col :lg="21">{{processinfo.name}}</el-col>
        </el-row>
        <el-row class="rowitem">
          <el-col :lg="3">
            <label>所属组织</label>
          </el-col>
          <el-col :lg="21">
            <span v-for="item in processinfo.processorgs" :key="item.id">{{item.organize.name}}</span>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <legend>流程步骤</legend>
        <el-row class="rowitem">
          <el-col :lg="3">
            <label>步骤</label>
          </el-col>
          <el-col :lg="5">
            <label>流程名称</label>
          </el-col>
          <el-col :lg="16">
            <label>审核人员</label>
          </el-col>
        </el-row>
        <el-row class="rowitem" v-for="item in processinfo.steps" :key="item.id">
          <el-col :lg="3">第{{item.stepno}}步</el-col>
          <el-col :lg="5">{{item.stepname}}</el-col>
          <el-col :lg="16">
            <span v-for="useritem in item.stepusers" :key="useritem.id">{{useritem.user.name}}</span>
          </el-col>
        </el-row>
      </fieldset>
    </el-dialog>

    <el-dialog title="编辑流程" top="10px" :visible.sync="dialog_show">
      <el-form :model="editdata" label-width="80px" label-position="rigth" size="small">
        <fieldset>
          <legend>基本信息</legend>
          <el-form-item label="流程名称">
            <el-input v-model="editdata.name" placeholder="请输入流程名称"></el-input>
          </el-form-item>
          <el-form-item label="所属组织">
            <el-select
              v-model="editdata.orgids"
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
          <el-row v-for="(item,index) in editdata.steps" :key="index">
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
              <el-button v-if="index===0" type="text" @click="add_edit_step(index)">新增</el-button>
              <el-button v-if="index!==0" type="text" @click="remove_edit_step(index)">删除</el-button>
            </el-col>
          </el-row>
        </fieldset>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog_show = false">取消</el-button>
        <el-button type="primary" @click="update_process">确定</el-button>
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
      dialog_view_show: false,
      queryform: {},
      processform: {
        status: 1,
        name: "",
        orgids: [],
        steps: []
      },
      editdata: {},
      processinfo: {},
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
    remove_edit_step(index) {
      this.editdata.steps.splice(index, 1);
    },
    add_edit_step(index) {
      this.editdata.steps.push({
        stepno: this.editdata.steps.length + 1,
        stepname: "",
        userid: []
      });
    },
    save_process() {
      ProcessFn.addprocess(this.processform).then(res => {
        this.$message.info(res.msg);
        if (res.code === 1) {
          this.dialog_show = false;
          this.getlist();
        }
      });
    },
    update_process() {
      ProcessFn.updateprocess(this.editdata).then(res => {
        this.$message.info(res.msg);
        if (res.code === 1) {
          this.dialog_show = false;
          this.getlist();
        }
      });
    },
    processedit(row) {
      this.editdata = row;
      this.editdata.oldsteps = row.steps;
      this.orglist = row.processorgs.map(function(i) {
        return {
          id: i.orgid,
          name: i.organize.name
        };
      });
      this.editdata.orgids = row.processorgs.map(function(i) {
        return i.orgid;
      });
      this.editdata.steps = row.steps.map(function(i) {
        return {
          stepno: i.stepno,
          stepname: i.stepname,
          userid: i.stepusers.map(function(j) {
            return j.userid;
          })
        };
      });
      this.dialog_show = true;
    },
    viewprocess(row) {
      this.processinfo = row;
      this.dialog_view_show = true;
    },
    processremove(row) {
      this.$confirm("你确定要删除该流程?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        ProcessFn.removeprocess({
          id: row.id
        }).then(res => {
          this.$message.info(res.message);
          if (res.code === 1) {
            this.getlist();
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.rowitem {
  height: 40px;
  line-break: 40px;
  padding: 8px;
  border-bottom: 1px solid rgb(214, 214, 214);
}
.rowitem label {
  font-weight: bold;
  font-size: 13px;
  color: black;
}
.rowitem span {
  margin-right: 15px;
}
</style>