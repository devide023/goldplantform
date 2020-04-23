<template>
  <div class="query_bar">
    <slot name="query_input">
      <el-select v-model="queryform.status" size="small" placeholder style="width:100px;">
        <el-option
          v-for="(item,index) in statuslist"
          :key="index"
          :label="item.name"
          :value="item.code"
        >{{item.name}}</el-option>
      </el-select>
      <el-input type="text" v-model="queryform.key" placeholder="关键字" size="small" class="keywords"></el-input>
      <el-date-picker
        v-model="queryform.ksrq"
        type="date"
        placeholder="开始日期"
        value-format="yyyy-MM-dd"
        size="small"
        class="datecss"
      ></el-date-picker>
      <el-date-picker
        v-model="queryform.jsrq"
        type="date"
        placeholder="结束日期"
        value-format="yyyy-MM-dd"
        size="small"
        class="datecss"
      ></el-date-picker>
      <el-button
        v-has="{fun:'query'}"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="onquery"
      >查询</el-button>
    </slot>
    <slot name="query_btn"></slot>
  </div>
</template>

<script>
import PubDb from "@/publicdata/index";
export default {
  data() {
    return {
      statuslist: [],
      queryform: {
        status: "",
        ksrq: "",
        jsrq: "",
        key: ""
      }
    };
  },
  mounted() {
    this.statuslist = PubDb.statuslist;
  },
  methods: {
    onquery() {
      this.$emit("query", this.queryform);
    }
  }
};
</script>

<style scoped>
.query_bar {
  padding: 5px;
}
.datecss {
  width: 140px;
}
.keywords {
  width: 200px;
}
</style>