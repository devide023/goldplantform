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
          <el-select v-model="form.shipno" placeholder="邮轮编号" size="mini" clearable>
            <el-option
              v-for="item in shiplist"
              :key="item.code"
              :value="item.code"
              :label="item.name"
            >{{item.name}}</el-option>
          </el-select>
        </el-col>
        <el-col :span="5" style="text-align:right;">
          <el-button type="primary" size="mini" icon="el-icon-search" @click="searh">查询</el-button>
          <slot name="query_btn"></slot>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index";
export default {
  props: {
    shiplist: {
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
        shipno: ""
      }
    };
  },
  mounted() {
    let date = new Date();
    let strdate1 =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    this.form.checkindate.push(parseTime(strdate1, "{y}-{m}-{d}"));
    this.form.checkindate.push(parseTime(strdate1, "{y}-{m}-{d}"));
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