<template>
  <div>
    <div class="querybar">
      <el-row>
        <el-col :span="6" :lg="6" :sm="10">
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
          ></el-date-picker>
        </el-col>
        <el-col :span="4" :lg="4" :sm="6">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="querydata">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" border stripe>
      <el-table-column label="日期" prop="rq"></el-table-column>
      <el-table-column label="人数" prop="bookcnt"></el-table-column>
      <el-table-column v-for="item in roomtypelist" :key="item.id" :label="item.name">
        <template slot-scope="scope">{{calc_roomtype_qty(scope.row.details,item.id)}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="view_detail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="详情" :visible.sync="dialogshow" top="10px">
      <el-table :data="detail_list">
        <el-table-column label="代理商" prop="agentname"></el-table-column>
        <el-table-column label="房型" prop="roomtypename"></el-table-column>
        <el-table-column label="数量" prop="qty"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import HotelFn from "@/api/hotel/index";
import ReportFn from "@/api/report/index";
import { parseTime } from "@/utils/index";
export default {
  data() {
    return {
      dialogshow: false,
      queryform: {
        date: []
      },
      roomtypelist: [],
      list: [],
      detail_list: []
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
      ReportFn.date_room_book(this.queryform).then(res => {
        this.list = res.result;
      });
    },
    querydata() {
      this.getlist();
    },
    view_detail(row) {
      ReportFn.date_room_book_detail({
        rq: row.rq
      }).then(res => {
        this.detail_list = res.result;
        this.dialogshow = true;
      });
    },
    calc_roomtype_qty(list, roomtypeid) {
      if (list) {
        let finded = list.filter(function(i) {
          return i.roomtypeid === roomtypeid;
        });
        if (finded.length > 0) {
          return finded[0].qty;
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