<template>
  <div>
    <div class="querybar">
      <el-button type="primary" @click="querydata" icon="el-icon-search" size="small">查询</el-button>
      <el-button type="success" @click="btn_add_book" icon="el-icon-plus" size="small">预订</el-button>
    </div>
    <el-table :data="list">
      <el-table-column label="邮轮名称" prop="shipname.name"></el-table-column>
      <el-table-column label="入住时段">
        <template slot-scope="scope">
          {{scope.row.bdate.substr(0,10)}}
          <br />
          {{scope.row.edate.substr(0,10)}}
        </template>
      </el-table-column>
      <el-table-column label="预订人" prop="bookname"></el-table-column>
      <el-table-column label="联系电话" prop="booktel"></el-table-column>
      <el-table-column label="人数" prop="bookcount"></el-table-column>
      <el-table-column label="费用" prop="amount"></el-table-column>
      <el-table-column label="备注" prop="booknote"></el-table-column>
      <el-table-column label="操作" width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="book_edit(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="book_view(scope.row)">查看</el-dropdown-item>
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

    <el-dialog :title="dialogtitle" :visible.sync="dialogshow" top="10px">
      <el-form :model="form" ref="form" :rules="rules">
        <fieldset>
          <legend>预订基本信息</legend>
          <el-form-item label="邮轮" prop="shipno" label-position="rigth" label-width="80px">
            <el-select v-model="form.shipno" size="small" style="width:100%">
              <el-option
                v-for="item in shiplist"
                :key="item.code"
                :value="item.code"
                :label="item.name"
              >{{item.name}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入住日期" prop="hoteldate" label-position="rigth" label-width="80px">
            <el-date-picker
              v-model="form.hoteldate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="姓名" prop="bookname" label-position="rigth" label-width="80px">
            <el-input v-model="form.bookname" size="small"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="booktel" label-position="rigth" label-width="80px">
            <el-input v-model="form.booktel" size="small"></el-input>
          </el-form-item>
          <el-form-item label="人数" prop="bookcount" label-position="rigth" label-width="80px">
            <el-input-number v-model="form.bookcount" :min="1" size="small"></el-input-number>
          </el-form-item>
          <el-form-item label="备注" label-position="rigth" label-width="80px">
            <el-input v-model="form.booknote" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>客房信息</legend>
          <el-row class="trow">
            <el-col :lg="6" :sm="4" class="thead">房型</el-col>
            <el-col :lg="4" :sm="3" class="thead">单价</el-col>
            <el-col :lg="5" :sm="8" class="thead">数量</el-col>
            <el-col :lg="5" :sm="3" class="thead">金额</el-col>
            <el-col :lg="4" :sm="6" class="thead">操作</el-col>
          </el-row>
          <el-row v-for="(item,index) in form.details" :key="index">
            <el-col :lg="6" :sm="4">
              <el-select
                v-model="item.roomtypeid"
                size="small"
                style="width:100%"
                @change="choose_room(index)"
              >
                <el-option
                  v-for="sitem in roomtypelist"
                  :key="sitem.id"
                  :value="sitem.id"
                  :label="sitem.name"
                >{{sitem.name}}</el-option>
              </el-select>
            </el-col>
            <el-col :lg="4" :sm="3" style="text-align: center">{{item.price}}&nbsp;</el-col>
            <el-col :lg="5" :sm="8" style="text-align: center">
              <el-input-number
                v-model="item.qty"
                :min="1"
                size="small"
                style="width:100px"
                @change="changqty_handle(index)"
              ></el-input-number>
            </el-col>
            <el-col :lg="5" :sm="3" style="text-align: center">{{item.amount}}&nbsp;</el-col>
            <el-col :lg="4" :sm="6" style="text-align: center">
              <el-button type="text" @click="remove_row(index)">删除</el-button>
            </el-col>
          </el-row>
        </fieldset>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogshow = false">取消</el-button>
        <el-button type="success" @click="add_room">添加房型</el-button>
        <el-button type="primary" @click="submit_book_data">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HotelFn from "@/api/hotel/index";
export default {
  data() {
    return {
      dialogshow: false,
      dialogtitle: "客房预订",
      shiplist: [],
      roomtypelist: [],
      list: [],
      queryform: {},
      form: {
        bookcount: 1,
        details: []
      },
      rules: {
        shipno: [
          {
            type: "string",
            required: true,
            message: "请选择邮轮",
            trigger: "blur"
          }
        ],
        hoteldate: [
          {
            type: "array",
            required: true,
            message: "请选择时间段",
            trigger: "change"
          }
        ],
        bookname: [
          {
            required: true,
            message: "请输入预订人姓名",
            trigger: "blur"
          }
        ],
        booktel: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "blur"
          }
        ],
        bookcount: [
          {
            required: true,
            message: "请输入人数",
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
    this.getlist();
  },
  methods: {
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
    getlist() {
      this.queryform.page = this.pageindex;
      this.queryform.pagesize = this.pagesize;
      HotelFn.book_room_list(this.queryform).then(res => {
        this.list = res.result.data;
        this.recordcount = res.result.total;
      });
    },
    querydata() {},
    btn_add_book() {
      this.dialogshow = true;
      this.dialogtitle = "客房预订";
    },
    add_room() {
      this.form.details.push({
        qty: "1"
      });
    },
    remove_row(index) {
      console.log(index);
      this.form.details.splice(index, 1);
    },
    choose_room(index) {
      let typeid = this.form.details[index].roomtypeid;
      let obj = this.roomtypelist.filter(function(i) {
        return i.id === typeid;
      });
      let amount =
        parseFloat(obj[0].price) * parseFloat(this.form.details[index].qty);
      this.form.details[index].price = obj[0].price;
      this.form.details[index].amount = amount;
    },
    changqty_handle(index) {
      this.choose_room(index);
    },
    submit_book_data() {
      this.$refs.form.validate(v => {
        if (v) {
          HotelFn.add_book_room(this.form).then(res => {
            this.$message.info(res.msg);
            if (res.code === 1) {
              this.dialogshow = false;
              this.getlist();
            }
          });
        }
      });
    },
    handleCurrentChange(index) {
      this.pageindex = index;
      this.getlist();
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getlist();
    },
    book_edit(row) {},
    book_view(row) {}
  }
};
</script>

<style>
.el-form-item {
  margin-bottom: 0px;
}
.trow {
  height: 30px;
  line-height: 30px;
}
.thead {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}
</style>