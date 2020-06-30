<template>
  <div>
    <div class="querybar">
      <el-row>
        <el-input v-model="queryform.name" placeholder="预订人" style="width:200px" size="mini"></el-input>
        <el-input v-model="queryform.tel" placeholder="联系电话" style="width:200px" size="mini"></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="querydata">查询</el-button>
        <el-button
          v-has="{fun:'add'}"
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="btn_book"
        >预订</el-button>
      </el-row>
    </div>
    <el-table :data="list">
      <el-table-column label="状态">
        <template slot-scope="scope">{{scope.row.status|statusname}}</template>
      </el-table-column>
      <el-table-column label="邮轮" prop="shipname.name"></el-table-column>
      <el-table-column label="预订人" prop="bookname"></el-table-column>
      <el-table-column label="联系电话" prop="booktel"></el-table-column>
      <el-table-column label="费用" prop="amount"></el-table-column>
      <el-table-column label="备注" prop="booknote"></el-table-column>
      <el-table-column label="操作员" prop="addusername.name"></el-table-column>
      <el-table-column label="操作日期" prop="addtime"></el-table-column>
      <el-table-column label="操作" width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-has="{fun:'edit'}" @click.native="edit_mealbook(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="view_mealbook(scope.row)">详情</el-dropdown-item>
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
        label-position="right"
        label-width="80px"
        size="small"
      >
        <fieldset>
          <legend>预订信息</legend>
          <el-form-item label="邮轮" prop="shipno">
            <el-select v-model="form.shipno" placeholder="选择邮轮" style="width:100%">
              <el-option
                v-for="item in shiplist"
                :key="item.code"
                :value="item.code"
                :label="item.name"
              >{{item.name}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用餐时间" prop="mealdate">
            <el-date-picker
              v-model="form.mealdate"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="请选择用餐时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="姓名" prop="bookname">
            <el-input v-model="form.bookname" placeholder="预订人姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="booktel">
            <el-input v-model="form.booktel" placeholder="联系电话"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="form.booknote"
              placeholder="备注"
            ></el-input>
          </el-form-item>
        </fieldset>
        <fieldset>
          <legend>用餐信息</legend>
          <el-row class="trrow">
            <el-col :span="7" class="thead">名称</el-col>
            <el-col :span="4" class="thead">单价</el-col>
            <el-col :span="5" class="thead">数量</el-col>
            <el-col :span="4" class="thead">金额</el-col>
            <el-col :span="4" class="thead">操作</el-col>
          </el-row>
          <el-row v-for="(item,index) in form.details" :key="index" class="trrow">
            <el-col :span="7" style="text-align: center">
              <el-select v-model="item.mealid" size="mini" @change="choose_meal(index)">
                <el-option
                  v-for="meal in meallist"
                  :key="meal.id"
                  :value="meal.id"
                  :label="meal.name"
                >{{meal.name}}</el-option>
              </el-select>
            </el-col>
            <el-col :span="4" style="text-align: center">{{item.price}}&nbsp;</el-col>
            <el-col :span="5" style="text-align: center">
              <el-input-number v-model="item.qty" :min="1" size="mini" @change="change_qty(index)"></el-input-number>
            </el-col>
            <el-col :span="4" style="text-align: center">{{item.amount}}&nbsp;</el-col>
            <el-col :span="4" style="text-align: center">
              <el-button type="text" @click="remove_row(index)">删除</el-button>
            </el-col>
          </el-row>
        </fieldset>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogshow = false">取消</el-button>
        <el-button type="success" @click="add_meal_item">添加用餐</el-button>
        <el-button type="primary" @click="submit_book_meal">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogtitle" :visible.sync="dialog_viewbookshow" top="10px">
      <fieldset>
        <legend>基本信息</legend>
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
        <legend>用餐详情</legend>
        <el-table :data="bookinfo.details">
          <el-table-column label="名称" prop="mealname.name"></el-table-column>
          <el-table-column label="单价" prop="price"></el-table-column>
          <el-table-column label="数量" prop="qty"></el-table-column>
          <el-table-column label="金额" prop="amount"></el-table-column>
        </el-table>
      </fieldset>
    </el-dialog>
  </div>
</template>

<script>
import HotelFn from "@/api/hotel/index";
export default {
  data() {
    return {
      dialogtitle: "预订餐",
      dialogshow: false,
      dialog_viewbookshow: false,
      shiplist: [],
      meallist: [],
      list: [],
      queryform: {},
      form: {
        bookname: "",
        booktel: "",
        booknote: "",
        shipno: "",
        details: []
      },
      bookinfo: {},
      rules: {
        shipno: [{ required: true, message: "请选择邮轮", trigger: "blur" }],
        mealdate: [
          { required: true, message: "请选择用餐时间", trigger: "blur" }
        ],
        bookname: [
          { required: true, message: "请输入预订人姓名", trigger: "blur" }
        ],
        booktel: [
          {
            required: true,
            message: "请输入联系电话",
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
    this.getmeallist();
    this.getlist();
  },
  methods: {
    getshiplist() {
      HotelFn.shiplist().then(res => {
        this.shiplist = res.result;
      });
    },
    getmeallist() {
      HotelFn.meallist({
        pagesize: 65535
      }).then(res => {
        this.meallist = res.result.data;
      });
    },
    getlist() {
      this.queryform.page = this.pageindex;
      this.queryform.pagesize = this.pagesize;
      HotelFn.mealbooklist(this.queryform).then(res => {
        this.list = res.result.data;
        this.recordcount = res.result.total;
      });
    },
    querydata() {
      this.pageindex = 1;
      this.getlist();
    },
    handleCurrentChange(index) {
      this.pageindex = index;
      this.getlist();
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getlist();
    },
    btn_book() {
      this.dialogtitle = "用餐预订";
      this.form = {
        details: []
      };
      this.dialogshow = true;
    },
    add_meal_item() {
      this.form.details.push({
        qty: 1
      });
    },
    choose_meal(index) {
      const mealid = this.form.details[index].mealid;
      let obj = this.meallist.filter(function(i) {
        return i.id === mealid;
      });
      if (obj) {
        this.form.details[index].price = obj[0].price;
        this.form.details[index].amount = (
          parseFloat(obj[0].price) * this.form.details[index].qty
        ).toFixed(2);
      }
    },
    change_qty(index) {
      this.choose_meal(index);
    },
    remove_row(index) {
      this.form.details.splice(index, 1);
    },
    submit_book_meal() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.form.id > 0) {
            HotelFn.editmealbook(this.form).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.dialogshow = false;
                this.getlist();
              }
            });
          } else {
            HotelFn.addmealbook(this.form).then(res => {
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
    view_mealbook(row) {
      this.bookinfo = row;
      this.dialogtitle = "预订详情";
      this.dialog_viewbookshow = true;
    },
    edit_mealbook(row) {
      this.form = row;
      this.dialogtitle = "编辑预订信息";
      this.dialogshow = true;
    }
  }
};
</script>

<style>
.el-dialog__body {
  padding-top: 0px;
}
.querybar {
  padding-left: 10px;
  padding-bottom: 10px;
  padding-top: 10px;
}
.el-form-item {
  margin-bottom: 0px;
}
.el-form-item--small.el-form-item {
  margin-bottom: 18px;
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