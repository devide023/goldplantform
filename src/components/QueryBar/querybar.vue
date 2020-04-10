<template>
  <div class="query_bar">
    <el-input type="text" v-model="key" placeholder="关键字" size="small" class="keywords"></el-input>
    <el-date-picker
      v-model="ksrq"
      type="date"
      placeholder="开始日期"
      value-format="yyyy-MM-dd"
      size="small"
      class="datecss"
    ></el-date-picker>
    <el-date-picker
      v-model="jsrq"
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
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ksrq: "",
      jsrq: "",
      key: ""
    };
  },
  methods: {
    onquery() {
      this.$emit("query", {
        ksrq: this.ksrq,
        jsrq: this.jsrq,
        key: this.key
      });
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