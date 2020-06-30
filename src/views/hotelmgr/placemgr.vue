import { formatTime } from '../../utils';
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
      <el-button type="warning" icon="el-icon-date" size="mini" @click="btn_place_date">日期位置</el-button>
    </div>
    <el-alert title="红色表示投放数量,紫色表示预订数量" type="warning" show-icon style="margin-bottom:10px;"></el-alert>
    <el-table :data="list" stripe border>
      <el-table-column label="邮轮" prop="shipname.name"></el-table-column>
      <el-table-column label="代理商" prop="agentname.name"></el-table-column>
      <el-table-column v-for="(item,index) in roomtypelist" :key="index" :label="item.name">
        <template slot-scope="scope">
          <span class="totalqty">
            {{
            calcqty(scope.row,item.id)
            }}
          </span>
          <br />
          <span class="bookqty">
            {{
            calcbookedqty(scope.row.shipno,scope.row.agentid,item.id)
            }}
          </span>
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

    <el-dialog :title="dialogtitle" :visible.sync="dialog_placedate_show" top="10px">
      <el-table :data="placedate_list" border strip>
        <el-table-column label="代理商" prop="agent.name"></el-table-column>
        <el-table-column label="开始日期">
          <template slot-scope="scope">{{scope.row.bdate|fmtdate}}</template>
        </el-table-column>
        <el-table-column label="结束日期">
          <template slot-scope="scope">{{scope.row.edate|fmtdate}}</template>
        </el-table-column>
        <el-table-column label="房型位置">
          <template slot-scope="scope">{{showplacedate_qty(scope.row.details)}}</template>
        </el-table-column>
        <el-table-column label="操作" width="50" fixed="right">
          <template slot-scope="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-setting" style="font-size:16px;"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="scope.row.status === 1"
                  @click.native="placedate_edit(scope.row)"
                >编辑</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog_placedate_show = false">取消</el-button>
        <el-button type="primary" @click="add_agentplace_date">设置</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogtitle" :visible.sync="dialog_addplacedate_show" top="10px">
      <el-form
        :model="placedate_form"
        ref="placedate_form"
        :rules="placedate_rules"
        label-position="right"
        label-width="100"
        size="small"
      >
        <el-form-item label="时间段" prop="bdate">
          <el-date-picker
            v-model="placedate_form.bdate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="代理商" prop="agentid">
          <el-select v-model="placedate_form.agentid" placeholder="选择代理商">
            <el-option
              v-for="item in agentlist"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(item,index) in placedate_form.details"
          :key="index"
          :label="item.roomtypename"
        >
          <el-input-number v-model="item.qty" :min="0" :step="1" size="small" placeholder="数量"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog_addplacedate_show = false">取消</el-button>
        <el-button type="primary" @click="submit_agentplace_date">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HotelFn from "@/api/hotel/index";
import AgentFn from "@/api/hotel/agent";
import BookFn from "@/api/hotel/report";
import { parseTime } from "@/utils/index";
export default {
  filters: {
    fmtdate: function(value) {
      return parseTime(value, "{y}-{m}-{d}");
    }
  },
  data() {
    return {
      dialogtitle: "",
      dialogshow: false,
      dialog_placedate_show: false,
      dialog_addplacedate_show: false,
      editflag: false,
      shiplist: [],
      roomtypelist: [],
      shiproomtypelist: [],
      agentlist: [],
      bookedroomlist: [],
      list: [],
      placedate_list: [],
      searchform: {},
      form: {
        status: 1,
        roomtypeqty: []
      },
      placedate_form: {
        bdate: [],
        details: []
      },
      rules: {
        shipno: [
          {
            required: true,
            message: "请选择邮轮",
            trigger: "blur"
          }
        ],
        agentid: [
          {
            required: true,
            message: "请选代理商",
            trigger: "blur"
          }
        ]
      },
      placedate_rules: {
        bdate: [
          {
            type: "array",
            required: true,
            message: "请选择时间段",
            trigger: "change"
          }
        ],
        agentid: [
          {
            required: true,
            message: "请选代理商",
            trigger: "blur"
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
    this.getbookedroomlist();
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
    placedateinit() {
      this.placedate_form.details = [];
      this.roomtypelist.forEach(i => {
        this.placedate_form.details.push({
          roomtypeid: i.id,
          roomtypename: i.name,
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

        this.placedateinit();
      });
    },
    getagentlist() {
      HotelFn.agentlist().then(res => {
        this.agentlist = res.result;
      });
    },
    getbookedroomlist() {
      BookFn.bookroom_report().then(res => {
        this.bookedroomlist = res.result;
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
        return parseFloat(obj[0].qty).toFixed(2);
      } else {
        return (0.0).toFixed(2);
      }
    },
    calcbookedqty(shipno, agentid, roomtypeid) {
      let qty = 0.0;
      this.bookedroomlist
        .filter(i => {
          return i.shipno === shipno && i.agentid === agentid;
        })
        .forEach(i => {
          i.roomtypes
            .filter(j => {
              return j.roomtypeid === roomtypeid;
            })
            .forEach(j => {
              qty = qty + parseFloat(j.qty);
            });
        });
      return qty.toFixed(2);
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
      this.getbookedroomlist();
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
    },
    get_placedate_list(data) {
      return AgentFn.placedatelist(data).then(res => {
        this.placedate_list = res.result.data;
      });
    },
    btn_place_date() {
      this.get_placedate_list({
        pagesize: 65535
      }).then(res => {
        this.dialogtitle = "日期位置";
        this.dialog_placedate_show = true;
      });
    },
    add_agentplace_date() {
      this.placedate_form.id = 0;
      this.dialogtitle = "设置日期位置";
      this.dialog_addplacedate_show = true;
    },
    submit_agentplace_date() {
      this.$refs.placedate_form.validate(v => {
        if (v) {
          if (this.placedate_form.id > 0) {
            AgentFn.edit_placedate(this.placedate_form).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.placedateinit();
                this.dialog_addplacedate_show = false;
                this.get_placedate_list({
                  pagesize: 65535
                });
              }
            });
          } else {
            AgentFn.add_placedate(this.placedate_form).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.placedateinit();
                this.dialog_addplacedate_show = false;
                this.get_placedate_list({
                  pagesize: 65535
                });
              }
            });
          }
        }
      });
    },
    showplacedate_qty(list) {
      if (list) {
        let ret = "";
        list.forEach(i => {
          ret = ret + i.roomtype.shortname + "：" + i.qty + " ";
        });
        return ret;
      }
    },
    placedate_edit(row) {
      this.placedate_form.id = row.id;
      this.placedate_form.agentid = row.agentid;
      this.placedate_form.bdate = [];
      this.placedate_form.bdate.push(row.bdate);
      this.placedate_form.bdate.push(row.edate);
      this.placedate_form.details.forEach(i => {
        let finded = row.details.filter(j => {
          return j.roomtypeid === i.roomtypeid;
        });
        if (finded.length > 0) {
          i.qty = finded[0].qty;
        } else {
          i.qty = 0;
        }
      });
      this.dialog_addplacedate_show = true;
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
.totalqty {
  color: red;
  font-weight: bold;
  font-size: 18px;
}
.bookqty {
  color: darkmagenta;
  font-weight: bold;
  font-size: 18px;
}
</style>