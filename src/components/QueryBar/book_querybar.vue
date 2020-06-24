<template>
  <div class="search-bar">
    <el-form :model="form" inline>
      <el-row :gutter="10">
        <el-col :span="5">
          <el-date-picker
            v-model="form.checkindate"
            type="daterange"
            range-separator="至"
            start-placeholder="入住开始日期"
            end-placeholder="入住结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            size="mini"
            clearable
            style="width:100%"
          ></el-date-picker>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            v-model="form.checkoutdate"
            type="daterange"
            range-separator="至"
            start-placeholder="退房开始日期"
            end-placeholder="退房结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            size="mini"
            clearable
            style="width:100%"
          ></el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-input v-model="form.tel" placeholder="联系电话" size="mini" clearable></el-input>
        </el-col>
        <el-col :span="3">
          <el-input v-model="form.name" placeholder="联系人" size="mini" clearable></el-input>
        </el-col>
        <el-col :span="3">
          <el-select
            v-if="userinfo.orgtype!=='05'"
            v-model="form.agentid"
            placeholder="选择代理商"
            size="mini"
            clearable
          >
            <el-option
              v-for="item in agents"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >{{item.name}}</el-option>
          </el-select>
        </el-col>
        <el-col :span="5" style="margin-top:-7px">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="searh">查询</el-button>
          <slot name="query_btn"></slot>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index";
import { getUserInfo } from "@/utils/auth";
export default {
  props: {
    shiplist: {
      type: Array,
      default: () => {
        return [];
      }
    },
    agents: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      form: {
        checkindate: [],
        checkoutdate: [],
        tel: "",
        name: "",
        shipno: "",
        agentid: ""
      },
      userinfo: {}
    };
  },
  mounted() {
    this.userinfo = JSON.parse(getUserInfo());
    this.form.checkindate.push(parseTime(new Date(), "{y}-{m}-{d}"));
    this.form.checkindate.push(parseTime(new Date(), "{y}-{m}-{d}"));
  },
  methods: {
    searh() {
      this.$emit("query", this.form);
    }
  }
};
</script>

<style scoped>
.search-bar {
  margin: 10px;
}
</style>