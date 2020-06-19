<template>
  <div>
    <div class="querybar">
      <el-input v-model="queryform.key" placeholder="关键字" size="small" style="width:300px;"></el-input>
      <el-button type="primary" @click="querydata" size="small" icon="el-icon-search">查询</el-button>
      <el-button type="success" @click="btn_addroomtype" size="small" icon="el-icon-plus">新增</el-button>
    </div>
    <el-table :data="list">
      <el-table-column label="状态">
        <template slot-scope="scope">{{scope.row.status|statusname}}</template>
      </el-table-column>
      <el-table-column label="房型名称" prop="name"></el-table-column>
      <el-table-column label="房型单价" prop="price"></el-table-column>
      <el-table-column label="房型总数量" prop="totalqty"></el-table-column>
      <el-table-column label="操作" width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="roomtype_edit(scope.row)">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogtitle" :visible.sync="dialogshow" top="10px">
      <el-form
        :model="form"
        ref="form"
        size="small"
        :rules="rules"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="房型名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入房型名称"></el-input>
        </el-form-item>
        <el-form-item label="房型单价" prop="price">
          <el-input type="number" v-model="form.price" placeholder="请输入房型单价"></el-input>
        </el-form-item>
        <el-form-item label="房型数量">
          <el-input type="number" v-model="form.totalqty" placeholder="请输入房型数量"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogshow = false">取消</el-button>
        <el-button type="primary" @click="submit_roomtype_data">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HotelFn from "@/api/hotel/index";

export default {
  data() {
    return {
      dialogtitle: "新增房型",
      dialogshow: false,
      queryform: {},
      shiplist: [],
      list: [],
      form: {},
      rules: {
        name: [
          {
            required: true,
            message: "请输入房型名称"
          }
        ],
        price: [
          {
            required: true,
            message: "请输入房型单价"
          }
        ]
      }
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
      HotelFn.roomtypelist().then(res => {
        this.list = res.result;
      });
    },
    querydata() {},
    btn_addroomtype() {
      this.form = {};
      this.dialogtitle = "添加房型信息";
      this.dialogshow = true;
    },
    submit_roomtype_data() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.form.id > 0) {
            HotelFn.editroomtype(this.form).then(res => {
              if (res.code === 1) {
                this.dialogshow = false;
                this.getlist();
              }
            });
          } else {
            HotelFn.addroomtype(this.form).then(res => {
              if (res.code === 1) {
                this.dialogshow = false;
                this.getlist();
              }
            });
          }
        }
      });
    },
    roomtype_edit(row) {
      this.form = row;
      this.dialogtitle = "编辑房型信息";
      this.dialogshow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.querybar {
  margin: 10px;
}
</style>