<template>
  <div class="querybar">
    <el-form :model="queryform" inline>
      <el-row>
        <el-col :lg="20" :xl="22">
          <el-select
            v-model="queryform.status"
            clearable
            placeholder="状态"
            size="mini"
            style="width:100px"
          >
            <el-option
              v-for="(item,index) in statuslist"
              :key="index"
              :value="item.code"
              :label="item.name"
            >{{item.name}}</el-option>
          </el-select>
          <el-select
            v-model="queryform.type"
            clearable
            placeholder="分类"
            size="mini"
            style="width:100px"
          >
            <el-option
              v-for="(item,index) in typelist"
              :key="index"
              :value="item.code"
              :label="item.name"
            >{{item.name}}</el-option>
          </el-select>
          <el-input
            v-model="queryform.repairno"
            placeholder="维修单号"
            size="mini"
            clearable
            style="width:180px"
          ></el-input>
          <el-input
            v-model="queryform.title"
            placeholder="维修标题"
            size="mini"
            clearable
            style="width:180px"
          ></el-input>
          <el-input
            v-model="queryform.adduser"
            placeholder="报修人"
            size="mini"
            clearable
            style="width:100px"
          ></el-input>
          <el-input
            v-model="queryform.sendperson"
            placeholder="派单人"
            size="mini"
            clearable
            style="width:100px"
          ></el-input>
          <el-input
            v-model="queryform.dealperson"
            placeholder="处理人"
            size="mini"
            clearable
            style="width:100px"
          ></el-input>
          <el-input
            v-model="queryform.enduser"
            placeholder="完结人"
            size="mini"
            clearable
            style="width:100px"
          ></el-input>
        </el-col>
        <el-col :lg="4" :xl="2">
          <el-button type="primary" @click="query" size="mini">查询</el-button>
          <el-button type="warning" @click="addrepair" size="mini">报修</el-button>
          <el-button type="success" :icon="iconname" @click="showmore" circle size="mini"></el-button>
        </el-col>
      </el-row>
      <el-row v-if="expand">
        <el-col :lg="24" :xl="24">
          <el-form-item label="派单日期">
            <el-date-picker
              v-model="queryform.senddate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              size="mini"
              style="width:250px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="报修日期">
            <el-date-picker
              v-model="queryform.adddate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              size="mini"
              style="width:250px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="完结日期">
            <el-date-picker
              v-model="queryform.enddate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              size="mini"
              style="width:250px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="queryform.note" size="mini" style="width:150px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="expand">
        <el-col :lg="24" :xl="24">
          <el-form-item label="报修内容"></el-form-item>
          <el-input v-model="queryform.substance" size="mini" style="width:150px"></el-input>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import BaseInfo from "@/api/baseinfo/index";
export default {
  data() {
    return {
      expand: false,
      iconname: "el-icon-caret-bottom",
      statuslist: [],
      typelist: [],
      queryform: {}
    };
  },
  mounted() {
    this.getstatuslist();
    this.gettypelist();
  },
  methods: {
    query() {
      this.$emit("query", this.queryform);
    },
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
    addrepair() {
      this.$emit("addrepair");
    },
    showmore() {
      this.expand = !this.expand;
      if (this.expand) {
        this.iconname = "el-icon-caret-top";
      } else {
        this.iconname = "el-icon-caret-bottom";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.querybar {
  padding: 5px 0px 0px 5px;
}
.el-form-item {
  margin-bottom: 0px;
}
</style>