<template>
  <div>
    <div class="querybar">
      <el-date-picker
        v-model="queryform.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        clearable
        size="mini"
        style="width:230px"
        placeholder
      ></el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="querydata" size="mini">查询</el-button>
    </div>
    <el-table :data="list" border stripe>
      <el-table-column label="日期" prop="rq"></el-table-column>
      <el-table-column label="代理商" prop="agentname"></el-table-column>
      <el-table-column label="人数" prop="bookcnt"></el-table-column>
      <el-table-column v-for="item in roomtypelist" :key="item.id" :label="item.name">
        <template slot-scope="scope">
          <b>{{calc_roomtype_qty(scope.row.details,item.id)}}</b>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import HotelFn from "@/api/hotel/index";
import ReportFn from "@/api/report/index";
import { parseTime } from "@/utils/index";
export default {
  data() {
    return {
      queryform: {
        date: []
      },
      roomtypelist: [],
      list: []
    };
  },
  mounted() {
    let rq = parseTime(new Date(), "{y}-{m}-{d}");
    this.queryform.date.push(rq);
    this.queryform.date.push(rq);
    this.getroomtypelist();
    this.getlist();
  },
  methods: {
    getroomtypelist() {
      HotelFn.roomtypelist().then(res => {
        this.roomtypelist = res.result;
      });
    },
    getlist() {
      ReportFn.agent_dateroombook_qty(this.queryform).then(res => {
        this.list = res.result;
      });
    },
    querydata() {
      this.getlist();
    },
    calc_roomtype_qty(list, roomtypeid) {
      if (list) {
        let f = list.filter(i => {
          return i.roomtypeid === roomtypeid;
        });
        if (f.length > 0) {
          return f[0].qty;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.querybar {
  margin-bottom: 10px;
  margin-left: 10px;
  margin-top: 10px;
}
</style>