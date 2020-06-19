<template>
  <div>
    <div class="querybar">
      <el-date-picker
        v-model="searchform.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        size="mini"
        style="width:270px"
        clearable
      ></el-date-picker>
      <el-select v-model="searchform.roomtype" placeholder="请选择房型" clearable size="mini">
        <el-option
          v-for="item in roomtypelist"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        >{{item.name}}</el-option>
      </el-select>
      <el-select v-model="searchform.agent" placeholder="请选择代理商" clearable size="mini">
        <el-option
          v-for="item in agentlist"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >{{item.name}}</el-option>
      </el-select>

      <el-button type="primary" icon="el-icon-search" size="mini" @click="querydata">查询</el-button>
    </div>
    <el-table :data="list" border stripe>
      <el-table-column label="代理商" prop="orgname"></el-table-column>
      <el-table-column label="房型" prop="name"></el-table-column>
      <el-table-column label="数量" prop="qty"></el-table-column>
      <el-table-column label="费用" prop="je"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import HotelFn from "@/api/hotel/index";
import ReportFn from "@/api/hotel/report";
import { parseTime } from "@/utils/index";
export default {
  data() {
    return {
      searchform: {
        date: []
      },
      roomtypelist: [],
      agentlist: [],
      list: []
    };
  },
  mounted() {
    let d1 = parseTime(new Date(), "{y}-{m}-{d}");
    this.searchform.date.push(d1);
    this.searchform.date.push(d1);
    this.getroomtypelist();
    this.getagentlist();
    this.getlist();
  },
  methods: {
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
      ReportFn.bookroom_report(this.searchform).then(res => {
        this.list = res.result;
      });
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
</style>