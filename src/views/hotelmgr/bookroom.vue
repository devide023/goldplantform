<template>
  <div>
    <query-bar @query="querydata" :shiplist="shiplist">
      <template #query_btn>
        <el-button type="success" @click="btn_add_book" icon="el-icon-plus" size="mini">预订</el-button>
      </template>
    </query-bar>
    <el-table :data="list">
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag :type="typename(scope.row.status)">{{scope.row.statusname.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="邮轮名称" prop="shipname.name"></el-table-column>
      <el-table-column label="入住日期">
        <template slot-scope="scope">{{scope.row.bdate|formatdate}}</template>
      </el-table-column>
      <el-table-column label="退房日期">
        <template slot-scope="scope">{{scope.row.edate|formatdate}}</template>
      </el-table-column>
      <el-table-column label="预订人" prop="bookname"></el-table-column>
      <el-table-column label="联系电话" prop="booktel"></el-table-column>
      <el-table-column label="人数" prop="bookcount"></el-table-column>
      <el-table-column label="费用" prop="amount"></el-table-column>
      <el-table-column label="备注" prop="booknote"></el-table-column>
      <el-table-column label="预订人" prop="addusername.name"></el-table-column>
      <el-table-column label="预订时间" prop="addtime"></el-table-column>
      <el-table-column label="操作" width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="book_edit(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="book_view(scope.row)">查看</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.status === 1" @click.native="book_ok(scope.row)">确定</el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.status === 1"
                @click.native="book_disagree(scope.row)"
              >拒绝</el-dropdown-item>
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
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        size="small"
        label-position="right"
        label-width="80px"
      >
        <fieldset>
          <legend>预订基本信息</legend>
          <el-form-item label="邮轮" prop="shipno">
            <el-select v-model="form.shipno" style="width:100%">
              <el-option
                v-for="item in shiplist"
                :key="item.code"
                :value="item.code"
                :label="item.name"
              >{{item.name}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入住日期" prop="hoteldate">
            <el-date-picker
              v-model="form.hoteldate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="姓名" prop="bookname">
            <el-input v-model="form.bookname" @input="change($event)"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="booktel">
            <el-input v-model="form.booktel" @input="change($event)"></el-input>
          </el-form-item>
          <el-form-item label="人数" prop="bookcount">
            <el-input-number v-model="form.bookcount" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="form.booknote"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              @input="change($event)"
            ></el-input>
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

    <el-dialog :title="dialogtitle" :visible.sync="dialogviewshow" top="10px">
      <fieldset>
        <legend>基本信息</legend>
        <el-row class="trow">
          <el-col :span="3" class="label">
            <label>用房时段：</label>
          </el-col>
          <el-col :span="21">{{bookinfo.bdate|formatdate}}至{{bookinfo.edate|formatdate}}</el-col>
        </el-row>
        <el-row class="trow">
          <el-col :span="3" class="label">
            <label>姓名：</label>
          </el-col>
          <el-col :span="21">{{bookinfo.bookname}}</el-col>
        </el-row>
        <el-row class="trow">
          <el-col :span="3" class="label">
            <label>联系电话：</label>
          </el-col>
          <el-col :span="21">{{bookinfo.booktel}}</el-col>
        </el-row>
        <el-row class="trow">
          <el-col :span="3" class="label">
            <label>预订人数：</label>
          </el-col>
          <el-col :span="21">{{bookinfo.bookcount}}</el-col>
        </el-row>
        <el-row class="trow">
          <el-col :span="3" class="label">
            <label>费用：</label>
          </el-col>
          <el-col :span="21">{{bookinfo.amount}}</el-col>
        </el-row>
        <el-row class="trow">
          <el-col :span="3" class="label">
            <label>备注：</label>
          </el-col>
          <el-col :span="21">{{bookinfo.booknote}}</el-col>
        </el-row>
      </fieldset>
      <fieldset>
        <legend>房型详情</legend>
        <el-table :data="bookinfo.details">
          <el-table-column label="房型名称" prop="roomtype.name"></el-table-column>
          <el-table-column label="单价" prop="price"></el-table-column>
          <el-table-column label="数量" prop="qty"></el-table-column>
          <el-table-column label="金额">
            <template slot-scope="scope">{{scope.row.price * scope.row.qty}}</template>
          </el-table-column>
        </el-table>
      </fieldset>
    </el-dialog>
  </div>
</template>

<script>
import HotelFn from "@/api/hotel/index";
import QueryBar from "@/components/QueryBar/book_querybar";
import { parseTime } from "@/utils/index";
export default {
  components: {
    "query-bar": QueryBar
  },
  filters: {
    formatdate: function(value) {
      if (value) {
        return parseTime(value, "{y}-{m}-{d}");
      } else {
        return value;
      }
    }
  },
  data() {
    return {
      dialogshow: false,
      dialogtitle: "客房预订",
      dialogviewshow: false,
      shiplist: [],
      roomtypelist: [],
      list: [],
      queryform: {},
      form: {
        hoteldate: [],
        bookcount: 1,
        details: []
      },
      bookinfo: {},
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
    typename(status) {
      let colorname = "";
      switch (status) {
        case 1:
          colorname = "success";
          break;
        case 2:
          colorname = "primary";
          break;
        case 3:
          colorname = "danger";
          break;
        default:
          break;
      }
      return colorname;
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
    getlist() {
      this.queryform.page = this.pageindex;
      this.queryform.pagesize = this.pagesize;
      HotelFn.book_room_list(this.queryform).then(res => {
        this.list = res.result.data;
        this.recordcount = res.result.total;
      });
    },
    querydata(data) {
      console.log(data);
      this.pageindex = 1;
      this.queryform = data;
      this.getlist();
    },
    btn_add_book() {
      this.dialogshow = true;
      this.form = { hoteldate: [], details: [] };
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
          if (this.form.id > 0) {
            HotelFn.edit_book_room(this.form).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.dialogshow = false;
                this.getlist();
              }
            });
          } else {
            HotelFn.add_book_room(this.form).then(res => {
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
    handleCurrentChange(index) {
      this.pageindex = index;
      this.getlist();
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getlist();
    },
    book_edit(row) {
      this.form.id = row.id;
      this.form.shipno = row.shipno;
      this.form.bookname = row.bookname;
      this.form.booktel = row.booktel;
      this.form.booknote = row.booknote;
      this.form.details = row.details;
      this.form.hoteldate = [];
      this.form.hoteldate.push(parseTime(row.bdate, "{y}-{m}-{d}"));
      this.form.hoteldate.push(parseTime(row.edate, "{y}-{m}-{d}"));
      this.dialogtitle = "编辑预订信息";
      this.dialogshow = true;
    },
    book_view(row) {
      this.bookinfo = row;
      this.dialogtitle = "预订查看";
      this.dialogviewshow = true;
    },
    book_ok(row) {
      this.$confirm("确认后待确认状态将转为确认状态,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        HotelFn.book_room_ok({
          id: row.id,
          status: 2
        }).then(res => {
          this.$message.info(res.msg);
          if (res.code === 1) {
            this.getlist();
          }
        });
      });
    },
    book_disagree(row) {
      this.$confirm("你确定要拒绝该预订?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        HotelFn.book_room_ok({
          id: row.id,
          status: 3
        }).then(res => {
          this.$message.info(res.msg);
          if (res.code === 1) {
            this.getlist();
          }
        });
      });
    },
    change(e) {
      this.$forceUpdate();
    }
  }
};
</script>

<style>
.el-dialog__body {
  padding-top: 0px;
}
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
.label {
  font-weight: bold;
  font-size: 13px;
  text-align: right;
  padding-right: 10px;
}
</style>