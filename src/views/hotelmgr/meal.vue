<template>
  <div>
    <div class="querybar">
      <el-row>
        <el-select v-model="queryform.status" placeholder="请选择状态" clearable size="mini">
          <el-option
            v-for="item in statuslist"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          >{{item.name}}</el-option>
        </el-select>
        <el-input v-model="queryform.keyword" placeholder="关键字" size="mini" style="width:200px"></el-input>

        <el-button type="primary" icon="el-icon-search" size="mini" @click="querydata">查询</el-button>
        <el-button type="success" icon="el-icon-plus" size="mini" @click="btn_addmeal">新增</el-button>
      </el-row>
    </div>
    <el-table :data="list">
      <el-table-column label="状态">
        <template slot-scope="scope">{{scope.row.status|statusname}}</template>
      </el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="操作员" prop="addusername.name"></el-table-column>
      <el-table-column label="操作日啊" prop="addtime"></el-table-column>
      <el-table-column label="操作" width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="edit_meal(scope.row)">编辑</el-dropdown-item>
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

    <el-dialog :title="dialog_title" :visible.sync="dialogshow" top="10px">
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-position="right"
        label-width="80px"
        size="mini"
      >
        <el-form-item label="邮轮" prop="shipno">
          <el-select v-model="form.shipno" placeholder="请选择邮轮">
            <el-option
              v-for="item in shiplist"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="套餐名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="套餐价格" prop="price">
          <el-input v-model="form.price" type="number" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.note"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="套餐描述/说明"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogshow = false">取消</el-button>
        <el-button type="primary" @click="submit_meal">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HotelFn from "@/api/hotel/index";
export default {
  data() {
    return {
      statuslist: [
        { code: 1, name: "启用" },
        { code: 0, name: "禁用" }
      ],
      dialog_title: "新增套餐",
      dialogshow: false,
      queryform: {
        keyword: ""
      },
      form: {},
      shiplist: [],
      list: [],
      rules: {
        shipno: [{ required: true, message: "请选择邮轮", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }]
      },
      recordcount: 0,
      pageindex: 1,
      pagesize: 15
    };
  },
  mounted() {
    this.getshiplist();
    this.getlist();
  },
  methods: {
    getshiplist() {
      HotelFn.shiplist().then(res => {
        this.shiplist = res.result;
      });
    },
    getlist() {
      this.queryform.page = this.pageindex;
      this.queryform.pagesize = this.pagesize;
      HotelFn.meallist(this.queryform).then(res => {
        this.list = res.result.data;
        this.recordcount = res.result.total;
      });
    },
    querydata() {
      this.pageindex = 1;
      this.queryform.page = this.pageindex;
      this.getlist();
    },
    btn_addmeal() {
      this.dialog_title = "新增套餐";
      this.form = {};
      this.dialogshow = true;
    },
    handleCurrentChange(index) {
      this.pageindex = index;
      this.getlist();
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getlist();
    },
    submit_meal() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.form.id > 0) {
            HotelFn.editmeal(this.form).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.dialogshow = false;
                this.getlist();
              }
            });
          } else {
            HotelFn.addmeal(this.form).then(res => {
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
    edit_meal(row) {
      this.dialog_title = "编辑套餐";
      this.form = row;
      this.dialogshow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.querybar {
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>