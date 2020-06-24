<template>
  <div>
    <div class="querybar">
      <el-select v-model="searchform.shipno" clearable size="mini" placeholder="请选择邮轮">
        <el-option
          v-for="item in shiplist"
          :key="item.id"
          :value="item.code"
          :label="item.name"
        >{{item.name}}</el-option>
      </el-select>
      <el-select v-model="searchform.roomtypeid" placeholder="请选择房型" clearable size="mini">
        <el-option
          v-for="item in roomtypelist"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        >{{item.name}}</el-option>
      </el-select>
      <el-select
        v-model="searchform.agentid"
        v-if="userinfo.orgtype !=='05'"
        placeholder="请选择代理商"
        clearable
        size="mini"
      >
        <el-option
          v-for="item in agentlist"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >{{item.name}}</el-option>
      </el-select>

      <el-button type="primary" icon="el-icon-search" size="mini" @click="querydata">查询</el-button>
    </div>
    <el-alert title="红色表示投放数量,紫色表示预订数量" type="warning" show-icon style="margin-bottom:10px;"></el-alert>
    <el-table :data="list" border stripe>
      <el-table-column label="邮轮" prop="shipname"></el-table-column>
      <el-table-column label="代理商" prop="agentname"></el-table-column>
      <el-table-column v-for="item in roomtypelist" :key="item.id" :label="item.name">
        <template slot-scope="scope">
          <span class="totalqty">
            {{
            calc_total_qty(scope.row.roomtypes,item.id)
            }}
          </span>
          <br />
          <span class="bookqty">
            {{
            calcqty(scope.row.roomtypes,item.id)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="费用">
        <template slot-scope="scope">
          {{
          calcje(scope.row.roomtypes)
          }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import HotelFn from "@/api/hotel/index";
import ReportFn from "@/api/hotel/report";
import { parseTime } from "@/utils/index";
import { getUserInfo } from "@/utils/auth";
export default {
  data() {
    return {
      userinfo: {},
      searchform: {
        date: []
      },
      shiplist: [],
      roomtypelist: [],
      agentlist: [],
      list: []
    };
  },
  mounted() {
    this.userinfo = JSON.parse(getUserInfo());
    let d1 = parseTime(new Date(), "{y}-{m}-{d}");
    this.searchform.date.push(d1);
    this.searchform.date.push(d1);
    this.getshiplist();
    this.getroomtypelist();
    this.getagentlist();
    this.getlist();
  },
  methods: {
    getshiplist() {
      HotelFn.allshiplist().then(res => {
        this.shiplist = res.result;
      });
    },
    getroomtypelist() {
      HotelFn.roomtypelist().then(res => {
        this.roomtypelist = res.result;
      });
    },
    getagentlist() {
      let querydata = {};
      if (this.userinfo.orgtype === "05") {
        querydata.id = this.userinfo.orgid;
      }
      HotelFn.agentlist(querydata).then(res => {
        this.agentlist = res.result;
      });
    },
    getlist() {
      if (this.userinfo.orgtype === "05") {
        this.searchform.agentid = this.userinfo.orgid;
      }
      ReportFn.bookroom_report(this.searchform).then(res => {
        this.list = res.result;
      });
    },
    calcje(list) {
      let totalje = 0;
      list.forEach(i => {
        totalje = totalje + parseFloat(i.amount);
      });
      return totalje.toFixed(2);
    },
    calc_total_qty(list, roomtypeid) {
      let fi = list.filter(function(i) {
        return i.roomtypeid === roomtypeid;
      });
      return fi.length > 0 ? parseFloat(fi[0].totalqty).toFixed(2) : 0;
    },
    calcqty(list, roomtypeid) {
      let fi = list.filter(function(i) {
        return i.roomtypeid === roomtypeid;
      });
      return fi.length > 0 ? parseFloat(fi[0].qty).toFixed(2) : 0;
    },
    querydata() {
      this.getlist();
    }
  }
};
</script>

<style lang="scss">
.querybar {
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
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