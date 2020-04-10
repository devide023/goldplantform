<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <el-button type @click="display()"></el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getMenus } from "@/utils/auth";
export default {
  name: "Dashboard",
  data() {
    return {
      list: []
    };
  },
  computed: {
    ...mapGetters(["name"])
  },
  methods: {
    display() {
      this.list = getMenus();
      console.log(this.list);
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
