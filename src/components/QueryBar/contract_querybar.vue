<template>
  <div class="query_bar">
    <el-form :model="queryform" inline>
      <el-row>
        <el-col :lg="20" :xl="21">
          <el-select
            v-model="queryform.status"
            clearable
            size="mini"
            placeholder="状态"
            style="width:100px"
          >
            <el-option
              v-for="item in statuslist"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            >{{item.name}}</el-option>
          </el-select>
          <el-select
            v-model="queryform.type"
            clearable
            size="mini"
            placeholder="类型"
            style="width:100px"
          >
            <el-option
              v-for="item in typelist"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            >{{item.name}}</el-option>
          </el-select>
          <el-input
            v-model="queryform.contractno"
            clearable
            size="mini"
            placeholder="编号"
            style="width:150px"
          ></el-input>

          <el-input
            v-model="queryform.name"
            clearable
            size="mini"
            placeholder="名称"
            style="width:150px"
          ></el-input>

          <el-input
            v-model="queryform.dutyperson"
            clearable
            size="mini"
            placeholder="负责人"
            style="width:100px;"
          ></el-input>
          <el-input
            v-model="queryform.payway"
            clearable
            size="mini"
            placeholder="支付方式"
            style="width:100px;"
          ></el-input>
          <el-input
            v-model="queryform.adduser"
            clearable
            size="mini"
            placeholder="操作人"
            style="width:100px;"
          ></el-input>
          <el-input
            v-model="queryform.contractcompany"
            clearable
            placeholder="承办单位"
            size="mini"
            style="width:150px"
          ></el-input>
        </el-col>
        <el-col :lg="4" :xl="3">
          <el-button type="primary" @click="query" size="mini">查询</el-button>
          <el-button type="warning" @click="addcontract" size="mini">新增</el-button>
          <el-button type="success" @click="showmore" :icon="moreicon" circle size="mini"></el-button>
        </el-col>
      </el-row>
      <el-row v-if="expand">
        <el-col :lg="24" :xl="24">
          <el-form-item label="签订时间">
            <el-date-picker
              v-model="queryform.signdate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              size="mini"
              style="width:250px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="金额">
            <el-input v-model="queryform.amount" size="mini" style="width:80px"></el-input>-
            <el-input v-model="queryform.amount1" size="mini" style="width:80px"></el-input>
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker
              v-model="queryform.edate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              size="mini"
              style="width:250px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="我方身份">
            <el-input v-model="queryform.cntidentity" clearable size="mini" style="width:100px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Baseinfo from "@/api/baseinfo/index";
export default {
  data() {
    return {
      expand: false,
      moreicon: "el-icon-arrow-down",
      statuslist: [],
      typelist: [],
      queryform: {}
    };
  },
  mounted() {
    this.getstatus();
    this.gettypelist();
  },
  methods: {
    getstatus() {
      Baseinfo.contractstatus().then(res => {
        this.statuslist = res.result;
      });
    },
    gettypelist() {
      Baseinfo.contracttypes().then(res => {
        this.typelist = res.result;
      });
    },
    showmore() {
      this.expand = !this.expand;
      if (this.expand) {
        this.moreicon = "el-icon-arrow-up";
      } else {
        this.moreicon = "el-icon-arrow-down";
      }
    },
    query() {
      this.$emit("query", this.queryform);
    },
    addcontract() {
      this.$emit("contractadd");
    }
  }
};
</script>

<style lang="scss" scoped>
.query_bar {
  padding: 5px 0px 0px 5px;
  margin: 0px;
}
.el-form-item {
  margin-bottom: 0px;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>