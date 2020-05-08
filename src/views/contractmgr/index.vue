<template>
  <div>
    <query-bar @query="querydata">
      <template #query_btn>
        <el-button size="small" type="success" icon="el-icon-plus" @click="btn_addcontract">新增合同</el-button>
      </template>
    </query-bar>
    <el-table :data="list">
      <el-table-column label="合同状态" prop="contractstatus.name"></el-table-column>
      <el-table-column label="合同编号" prop="contractno"></el-table-column>
      <el-table-column label="类型" prop="contraccttype.name"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="附件">
        <template slot-scope="scope">
          <el-button type="text">{{scope.row.contractfiles.length}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="合同金额" prop="amount"></el-table-column>
      <el-table-column label="已付/付款方式">
        <template slot-scope="scope">
          {{scope.row.payedamount}}
          <br />
          {{scope.row.payway}}
        </template>
      </el-table-column>
      <el-table-column label="承办单位" prop="contractcompany"></el-table-column>
      <el-table-column label="承办人/电话">
        <template slot-scope="scope">
          {{scope.row.contractor}}
          <br />
          {{scope.row.contractortel}}
        </template>
      </el-table-column>
      <el-table-column label="签订日期">
        <template slot-scope="scope">{{scope.row.signdate|formatdate}}</template>
      </el-table-column>
      <el-table-column label="操作人/日期">
        <template slot-scope="scope">
          {{scope.row.adduser.name}}
          <br />
          {{scope.row.addtime|formatdate}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50" fixed="right">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size:16px;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="contract_edit(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="upload_contract(scope.row)">合同文件</el-dropdown-item>
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
        label-width="100px"
        label-position="right"
        size="small"
      >
        <el-form-item label="合同状态" prop="status">
          <el-select v-model="form.status" placeholder style="width:100%">
            <el-option
              v-for="item in statuslist"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractno">
          <el-input v-model="form.contractno" readonly placeholder></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="name">
          <el-input v-model="form.name" placeholder></el-input>
        </el-form-item>
        <el-form-item label="合同类型" prop="type">
          <el-select v-model="form.type" placeholder style="width:100%">
            <el-option
              v-for="item in typelist"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            >{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="我方身份" prop="cntidentity">
          <el-input v-model="form.cntidentity" placeholder></el-input>
        </el-form-item>
        <el-form-item label="合同金额" prop="amount">
          <el-input type="number" v-model="form.amount" placeholder></el-input>
        </el-form-item>
        <el-form-item label="已付金额">
          <el-input type="number" v-model="form.payedamount" value="0" placeholder></el-input>
        </el-form-item>
        <el-form-item label="资金流向" prop="moneyflow">
          <el-input v-model="form.moneyflow" placeholder></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-input v-model="form.payway" placeholder></el-input>
        </el-form-item>
        <el-form-item label="承办单位" prop="contractcompany">
          <el-input v-model="form.contractcompany" placeholder></el-input>
        </el-form-item>
        <el-form-item label="承办人">
          <el-input v-model="form.contractor" placeholder></el-input>
        </el-form-item>
        <el-form-item label="承办人电话">
          <el-input v-model="form.contractortel" placeholder></el-input>
        </el-form-item>
        <el-form-item label="合同负责人" prop="dutyperson">
          <el-input v-model="form.dutyperson" placeholder></el-input>
        </el-form-item>
        <el-form-item label="负责人电话">
          <el-input v-model="form.dutypersontel" placeholder></el-input>
        </el-form-item>
        <el-form-item label="合同期限">
          <el-date-picker
            v-model="pickdate"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="签订日期" prop="signdate">
          <el-date-picker v-model="form.signdate" type="date" value-format="yyyy-MM-dd" placeholder></el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialog_show = false">取消</el-button>
        <el-button type="primary" @click="save_contract">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="合同附件" :visible.sync="dialog_upload_show" top="10px">
      <el-table :data="contract_filelist">
        <el-table-column label="文件名" prop="filename" width="200"></el-table-column>
        <el-table-column label="文件类型" prop="filetype" width="80"></el-table-column>
        <el-table-column label="文件大小" prop="filesize" width="80"></el-table-column>
        <el-table-column label="上传者" prop="adduser.name" width="70"></el-table-column>
        <el-table-column label="上传日期" prop="addtime"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="download_file(scope.row)" type="text" size="small">下载</el-button>
            <el-button type="text" size="small" @click="removefile(scope.row.file)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-upload
        class="upload-files"
        ref="upload_contract"
        :headers="headers"
        :action="uploadpath"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="contract_files"
        :auto-upload="false"
        :data="uploaddata"
        multiple
      >
        <el-button slot="trigger" size="small" type="primary">选择合同</el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="upload_contract_files"
        >上传合同</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import QueryBar from "@/components/QueryBar/querybar";
import ContractFn from "@/api/contract/index";
import BaseInfo from "@/api/baseinfo/index";
import { parseTime } from "@/utils/index";
import { getToken } from "@/utils/auth";
import tool from "@/api/utils/tool";
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
      dialog_title: "录入合同",
      editflag: false,
      dialog_show: false,
      dialog_upload_show: false,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + getToken()
      },
      uploaddata: {},
      uploadpath: ContractFn.upload_contract_url,
      contract_files: [],
      list: [],
      typelist: [],
      paywaylist: [],
      statuslist: [],
      contract_filelist: [],
      form: {},
      pickdate: [],
      rules: {
        status: [
          {
            required: true,
            message: "请选择合同状态",
            trigger: "change"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择合同类型",
            trigger: "change"
          }
        ],
        contractno: [
          { required: true, message: "请输入合同编号", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入合同名称", trigger: "blur" }],
        amount: [
          { required: true, message: "请输入合同金额", trigger: "blur" }
        ],
        contractcompany: [
          { required: true, message: "请输入承办单位", trigger: "blur" }
        ],
        signdate: [
          { required: true, message: "请输入签订日期", trigger: "blur" }
        ],
        moneyflow: [
          { required: true, message: "请输入资金流向", trigger: "blur" }
        ],
        cntidentity: [
          { required: true, message: "请输入我方身份", trigger: "blur" }
        ],
        dutyperson: [
          { required: true, message: "请输入合同负责人", trigger: "blur" }
        ]
      },
      recordcount: 0,
      pageindex: 1,
      pagesize: 15
    };
  },
  mounted() {
    this.gettypelist();
    this.getstatuslist();
    this.getcontractlist();
  },
  methods: {
    getcontractlist() {
      ContractFn.list({
        pagesize: this.pagesize
      }).then(res => {
        this.list = res.result.data;
        this.recordcount = res.result.total;
      });
    },
    gettypelist() {
      BaseInfo.contracttypes().then(res => {
        this.typelist = res.result;
      });
    },
    getstatuslist() {
      BaseInfo.contractstatus().then(res => {
        this.statuslist = res.result;
      });
    },
    getcontractfiles(id) {
      ContractFn.contractfilesbyid({
        id: id
      }).then(res => {
        this.contract_filelist = res.result;
      });
    },
    remove_contractfile(filename) {
      ContractFn.delcontract_file({
        filename: filename
      }).then(res => {
        this.$message.info(res.msg);
        this.getcontractfiles(this.uploaddata.contractid);
      });
    },
    querydata(data) {},
    btn_addcontract() {
      ContractFn.getcontractno().then(res => {
        this.editflag = false;
        this.form = {};
        this.form.contractno = res.result;
        this.dialog_show = true;
      });
    },
    handleCurrentChange(index) {
      this.pageindex = index;
      this.getcontractlist();
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getcontractlist();
    },
    contract_edit(row) {
      this.form = row;
      this.dialog_title = "合同编辑";
      let temp = [];
      if (row.bdate) {
        temp.push(row.bdate);
      }
      if (row.edate) {
        temp.push(row.edate);
      }
      console.log(temp);
      this.pickdate = temp;
      this.editflag = true;
      this.dialog_show = true;
    },
    save_contract() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.pickdate.length === 2) {
            this.form.bdate = this.pickdate[0];
            this.form.edate = this.pickdate[1];
          }
          if (this.editflag) {
            ContractFn.update_contract(this.form).then(res => {
              this.$message.info(res.msg);
              this.dialog_show = false;
              this.getcontractlist();
            });
          } else {
            ContractFn.add_contract(this.form).then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                this.form = {};
                this.dialog_show = false;
                this.getcontractlist();
              }
            });
          }
        }
      });
    },
    upload_contract_files() {
      this.$refs.upload_contract.submit();
      this.contract_files = [];
      this.getcontractfiles(this.uploaddata.contractid);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      let filename = file.response.result;
      if (file.status === "success") {
        this.remove_contractfile(filename);
      }
    },
    download_file(row) {
      let a = document.createElement("a");
      a.href = tool.baseurl + "/contract/" + row.file;
      a.target = "_blank";
      a.click();
    },
    handlePreview(file) {
      console.log(file);
    },
    upload_contract(row) {
      this.getcontractfiles(row.id);
      this.uploaddata.contractid = row.id;
      this.dialog_upload_show = true;
    },
    removefile(file) {
      this.$confirm("你确定要删除该合同文件?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.remove_contractfile(file);
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-files {
  margin-top: 20px;
}
</style>