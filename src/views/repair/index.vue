import { rules } from '../../../.eslintrc';
<template>
  <div>
    <query-bar @query="querydata" @addrepair="btn_addrepair"></query-bar>
    <el-table :data="list">
      <el-table-column label="状态" prop="statusname.name"></el-table-column>
      <el-table-column label="类型" prop="typename.name"></el-table-column>
      <el-table-column label="报修单号" prop="repairno"></el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="报修人/时间">
        <template slot-scope="scope">
          {{scope.row.adduser}}
          <br />
          {{scope.row.addtime|formatdate}}
        </template>
      </el-table-column>
      <el-table-column label="处理人">
        <template slot-scope="scope">{{scope.row.dealperson}}</template>
      </el-table-column>
      <el-table-column label="派单人/时间">
        <template slot-scope="scope">
          {{scope.row.sendperson}}
          <br />
          {{scope.row.sendtime|formatdate}}
        </template>
      </el-table-column>
      <el-table-column label="完结人/时间">
        <template slot-scope="scope">
          {{scope.row.enduser}}
          <br />
          {{scope.row.endtime|formatdate}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="repair_edit(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="repair_detail(scope.row)">详情</el-dropdown-item>
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

    <el-dialog :title="dialog_title" :visible.sync="dialog_show" top="10px">
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        size="small"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="状态" style="width:100%">
            <el-option
              v-for="item in statuslist"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="类型" style="width:100%">
            <el-option
              v-for="item in typelist"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报修单号" prop="repairno">
          <el-input v-model="form.repairno" readonly placeholder="报修单号"></el-input>
        </el-form-item>
        <el-form-item label="报修标题" prop="title">
          <el-input v-model="form.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item label="情况描述" prop="substance">
          <el-input
            v-model="form.substance"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5}"
            placeholder="请输入问题描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片上传">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-remove="RemoveImg"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="报修人">
          <el-input v-model="form.adduser" placeholder="报修人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="addusertel">
          <el-input type="tel" v-model="form.addusertel" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.note" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog_show = false">取消</el-button>
        <el-button type="primary" @click="repair_submit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QueryBar from "@/components/QueryBar/repair_querybar";
import RepairFn from "@/api/repair/index";
import BaseInfo from "@/api/baseinfo/index";
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
      dialog_show: false,
      dialog_title: "报修单",
      editflag: false,
      list: [],
      statuslist: [],
      typelist: [],
      form: {},
      rules: {
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur"
          }
        ],
        repairno: [
          { required: true, message: "请输入报修单号", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入报修标题", trigger: "blur" }],
        substance: [
          { required: true, message: "请描述报修情况", trigger: "blur" }
        ],
        addusertel: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ]
      },
      recordcount: 0,
      pageindex: 1,
      pagesize: 15
    };
  },
  mounted() {
    this.getstatuslist();
    this.gettypelist();
    this.getlist();
  },
  methods: {
    getstatuslist() {
      BaseInfo.repairstatus().then(res => {
        this.statuslist = res.result;
      });
    },
    gettypelist() {
      BaseInfo.repairtypes().then(res => {
        this.typelist = res.result;
      });
    },
    getlist() {
      RepairFn.list({}).then(res => {
        this.list = res.result.data;
        this.recordcount = res.result.total;
      });
    },
    querydata(data) {
      RepairFn.list(data).then(res => {
        this.list = res.result.data;
        this.pageindex = 1;
        this.recordcount = res.result.total;
      });
    },
    btn_addrepair() {
      RepairFn.repairno().then(res => {
        this.form.repairno = res.result;
      });
      this.form.adduser = this.$store.getters.name;
      this.editflag = false;
      this.dialog_show = true;
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getlist();
    },
    handleCurrentChange(index) {
      this.pageindex = index;
      this.getlist();
    },
    repair_edit(row) {},
    repair_detail(row) {},
    repair_submit() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.editflag) {
            RepairFn.edit(this.form).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.getlist();
                this.dialog_show = false;
              }
            });
          } else {
            RepairFn.add(this.form).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.getlist();
                this.dialog_show = false;
              }
            });
          }
        }
      });
    },
    RemoveImg() {}
  }
};
</script>

<style lang="scss" scoped>
</style>