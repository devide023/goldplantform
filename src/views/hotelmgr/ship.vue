<template>
  <div>
    <div class="querybar">
      <el-input v-model="searchform.keyword" placeholder="关键字" style="width:150px" size="mini"></el-input>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="querydata">查询</el-button>
    </div>
    <el-table :data="list">
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status===0?'danger':''">{{scope.row.status | statusname}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="邮轮编号" prop="code"></el-table-column>
      <el-table-column label="邮轮名称" prop="name"></el-table-column>
      <el-table-column label="操作人" prop="addusername.name"></el-table-column>
      <el-table-column label="日期" prop="addtime"></el-table-column>
      <el-table-column label="操作" width="50px" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="ship_room_type(scope.row)">房型</el-dropdown-item>
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
        label-width="80px"
        size="small"
      >
        <el-checkbox-group v-model="form.roomtypes">
          <el-checkbox v-for="item in roomtypelist" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogshow = false">取消</el-button>
        <el-button type="primary" @click="submit_ship_roomtype">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HotelFn from "@/api/hotel/index";
export default {
  data() {
    return {
      dialogtitle: "",
      dialogshow: false,
      searchform: {
        keyword: ""
      },
      roomtypelist: [],
      list: [],
      form: {
        roomtypes: []
      },
      rules: {
        roomtypes: [
          {
            type: "array",
            required: true,
            message: "请选择房型",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.getroomtypelist();
    this.getlist();
  },
  methods: {
    getroomtypelist() {
      HotelFn.roomtypelist({
        status: 1
      }).then(res => {
        this.roomtypelist = res.result;
      });
    },
    getlist() {
      HotelFn.allshiplist(this.searchform).then(res => {
        this.list = res.result;
      });
    },
    querydata() {},
    ship_room_type(row) {
      let that = this;
      this.form.roomtypes = [];
      HotelFn.get_ship_roomtype_list({
        shipno: row.code
      }).then(res => {
        this.dialogtitle = "房型关联";
        this.form.shipno = row.code;
        res.result.forEach(function(i) {
          that.form.roomtypes.push(i.roomtypeid);
        });
        this.dialogshow = true;
      });
    },
    submit_ship_roomtype() {
      this.$refs.form.validate(v => {
        if (v) {
          HotelFn.add_ship_roomtype(this.form).then(res => {
            this.$message.info(res.msg);
            if (res.code === 1) {
              this.dialogshow = false;
            }
          });
        }
      });
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
</style>