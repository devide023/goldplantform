<template>
  <div>
    <div class="querybar">
      <el-select v-model="searchform.shipno" clearable placeholder="选择邮轮" size="mini">
        <el-option
          v-for="item in shiplist"
          :key="item.id"
          :value="item.code"
          :label="item.name"
        >{{item.name}}</el-option>
      </el-select>
      <el-select v-model="searchform.agentid" clearable placeholder="选择代理商" size="mini">
        <el-option
          v-for="item in agentlist"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        >{{item.name}}</el-option>
      </el-select>
      <el-select v-model="searchform.roomtypeid" clearable placeholder="选择房型" size="mini">
        <el-option
          v-for="item in roomtypelist"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >{{item.name}}</el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="querydata" size="mini">查询</el-button>
      <el-button type="success" icon="el-icon-plus" size="mini" @click="btn_add_place">添加</el-button>
    </div>
    <el-table :data="list" stripe border>
      <el-table-column label="邮轮" prop="shipname.name"></el-table-column>
      <el-table-column label="代理商" prop="agentname.name"></el-table-column>
      <el-table-column v-for="(item,index) in roomtypelist" :key="index" :label="item.name">
        <template slot-scope="scope">
          {{
          calcqty(scope.row,item.id)
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="addusername.name"></el-table-column>
      <el-table-column label="操作时间" prop="addtime"></el-table-column>
      <el-table-column label="操作" width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="edit_agentplace(scope.row)">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogtitle" :visible.sync="dialogshow" top="10px">
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
        size="small"
      >
        <el-form-item label="邮轮" prop="shipno">
          <el-select
            v-model="form.shipno"
            :disabled="editflag"
            placeholder="请选择邮轮编号"
            @change="ship_change_handle"
          >
            <el-option
              v-for="item in shiplist"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代理商" prop="agentid">
          <el-select v-model="form.agentid" :disabled="editflag" placeholder="选择代理商">
            <el-option
              v-for="item in agentlist"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(item,index) in shiproomtypelist"
          :key="item.id"
          :label="item.roomtypename.name"
        >
          <el-input-number v-model="form.roomtypeqty[index].qty" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogshow = false">取消</el-button>
        <el-button type="primary" @click="submit_agent_place">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HotelFn from "@/api/hotel/index";
import AgentFn from "@/api/hotel/agent";
export default {
  data() {
    return {
      dialogtitle: "",
      dialogshow: false,
      editflag: false,
      shiplist: [],
      roomtypelist: [],
      shiproomtypelist: [],
      agentlist: [],
      list: [],
      searchform: {},
      form: {
        status: 1,
        roomtypeqty: []
      },
      rules: {
        shipno: [
          {
            required: true,
            message: "请选择邮轮",
            trigger: blur
          }
        ],
        agentid: [
          {
            required: true,
            message: "请选代理商",
            trigger: blur
          }
        ]
      },
      recordcount: 0,
      pageindex: 1,
      pagesize: 15
    };
  },
  mounted() {
    this.getshiplist();
    this.getroomtypelist();
    this.getagentlist();
    this.getlist();
  },
  methods: {
    init() {
      let that = this;
      this.form.status = 1;
      this.form.roomtypeqty = [];
      this.shiproomtypelist.forEach(function(v, i) {
        that.form.roomtypeqty.push({
          roomtypeid: v.roomtypeid,
          roomtypenmae: v.roomtypename.name,
          qty: 0
        });
      });
    },
    getshiplist() {
      HotelFn.shiplist().then(res => {
        this.shiplist = res.result;
      });
    },
    getroomtypelist() {
      HotelFn.roomtypelist().then(res => {
        this.roomtypelist = res.result;
      });
    },
    getagentlist() {
      HotelFn.agentlist().then(res => {
        this.agentlist = res.result;
      });
    },
    getlist() {
      this.searchform.page = this.pageindex;
      this.searchform.pagesize = this.pagesize;
      AgentFn.agent_placelist(this.searchform).then(res => {
        this.list = res.result.data;
        this.recordcount = res.result.total;
      });
    },
    btn_add_place() {
      this.editflag = false;
      this.dialogtitle = "代理房型位置设置";
      this.form.id = 0;
      this.init();
      this.dialogshow = true;
    },
    calcqty(row, roomtypeid) {
      let obj = row.details.filter(function(i) {
        return i.roomtypeid === roomtypeid;
      });
      if (obj.length > 0) {
        return obj[0].qty;
      } else {
        return 0.0;
      }
    },
    ship_change_handle(v) {
      HotelFn.get_ship_roomtype_list({
        shipno: v
      }).then(res => {
        this.shiproomtypelist = res.result;
        this.init();
      });
    },
    submit_agent_place() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.form.id > 0) {
            AgentFn.editplace(this.form).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.dialogshow = false;
                this.getlist();
              }
            });
          } else {
            AgentFn.addplace(this.form).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.dialogshow = false;
                this.getlist();
              }
            });
          }
        }
      });
    },
    querydata() {
      this.pageindex = 1;
      this.getlist();
    },
    edit_agentplace(row) {
      this.editflag = true;
      HotelFn.get_ship_roomtype_list({
        shipno: row.shipno
      }).then(res => {
        this.shiproomtypelist = res.result;
        this.init();
        this.form.shipno = row.shipno;
        this.form.id = row.id;
        this.form.agentid = row.agentid;
        this.form.roomtypeqty.forEach(function(i) {
          let t = row.details.filter(j => {
            return j.roomtypeid === i.roomtypeid;
          });
          i.qty = t.length > 0 ? t[0].qty : 0;
        });
        this.dialogtitle = "信息编辑";
        this.dialogshow = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.querybar {
  padding-bottom: 10px;
  padding-left: 10px;
  padding-top: 10px;
}
</style>