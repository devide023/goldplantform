<template>
  <div>
    <div class="operate_bar">
      <el-input v-model="key" placeholder="输入关键字进行过滤" size="small" style="width:200px;"></el-input>
      <el-button type="primary" size="small" icon="el-icon-edit" @click="edit_organize_tree">编辑节点树</el-button>
      <el-button type="success" size="small" icon="el-icon-info" @click="edit_nodeinfo">编辑节点信息</el-button>
      <el-upload
        :action="uploadurl"
        :show-file-list="false"
        :multiple="false"
        class="myupload"
        :on-success="uploadsuccess"
        :on-error="uploaderror"
        :before-upload="beforeUpload"
      >
        <el-button size="small" type="primary">导入文件</el-button>
      </el-upload>
    </div>
    <el-tree
      :load="loadnode"
      lazy
      show-checkbox
      node_key="id"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      ref="tree"
      highlight-current
    ></el-tree>
    <el-dialog title="组织节点树" :visible.sync="dialogshow" top="10px">
      <div class="mytree">
        <el-tree :data="list" node-key="nodeid" default-expand-all :expand-on-click-node="false">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span v-if="data.isedit">
              <el-input
                v-model="node.data.label"
                size="mini"
                @blur="overedit(node,data)"
              >{{ data.label }}</el-input>
            </span>
            <span v-else>{{ data.label }}</span>
            <span>
              <el-button type="text" size="mini" @click="append(data)">
                <svg-icon icon-class="plus-circle" style="font-size:15px;color:blue;"></svg-icon>
              </el-button>
              <el-button type="text" size="mini" @click="edit(node, data)">
                <svg-icon icon-class="edit" style="font-size:15px;"></svg-icon>
              </el-button>
              <el-button type="text" size="mini" @click="remove(node, data)">
                <svg-icon icon-class="minus-circle" style="font-size:15px;color:red;"></svg-icon>
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
      <div slot="footer">
        <el-button type="success" icon="el-icon-plus" @click="add_rootnode">新增根节点</el-button>
        <el-button type="primary" icon="el-icon-check" @click="save_organize_tree">确定</el-button>
        <el-button type="danger" icon="el-icon-close" @click="dialogshow=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑节点信息" :visible.sync="formdialog" top="10px">
      <el-form :model="nodeform" label-width="80px" size="small" label-position="right">
        <el-form-item label="名称">
          <el-input v-model="nodeform.title" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="nodeform.orgtype" placeholder="请选择">
            <el-option
              v-for="item in orgtype_options"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="nodeform.code" placeholder="编码"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="nodeform.leader" placeholder="负责人"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="nodeform.logo" placeholder="图标"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="update_nodeinfo">确定</el-button>
        <el-button type="danger" @click="formdialog=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OrgFun from "@/api/organize/index";
export default {
  data() {
    return {
      key: "",
      nodeid: 1,
      list: [],
      orgtree: [],
      dialogshow: false,
      formdialog: false,
      nodeform: {},
      orgtype_options: []
    };
  },
  watch: {
    key(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.gettree_data();
  },
  methods: {
    loadnode(node, resolve) {
      console.log(node);
      let pid = 0;
      if (node.level > 0) {
        pid = node.data.id;
      }
      OrgFun.subnodes({
        id: pid
      }).then(res => {
        let nodes = res.result.map(function(i) {
          if (i.orgtype === "03") {
            i.leaf = true;
          } else {
            i.leaf = false;
          }
          return i;
        });
        resolve(nodes);
      });
    },
    gettree_data() {
      OrgFun.getorgtree({
        pagesize: 65535
      }).then(res => {
        // const Fn = Function;
        // this.nodeid = res.nodeid;
        // this.list = new Fn("return " + res.data)();
        // this.orgtree = new Fn("return " + res.data)();
        this.orgtree = res.result.data.map(function(i) {
          return {
            id: i.id,
            pid: i.pid,
            label: i.name,
            orgcode: i.orgcode,
            orgtype: i.orgtype
          };
        });
      });
    },
    append(data) {
      const newChild = {
        nodeid: this.nodeid++,
        isedit: false,
        parentid: data.nodeid,
        label: "新节点"
      };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.nodeid === data.nodeid);
      children.splice(index, 1);
    },
    add_rootnode() {
      this.list.push({
        label: "根节点",
        nodeid: this.nodeid,
        parentid: 0,
        isedit: false
      });
      this.nodeid++;
    },
    edit(node, data) {
      node.data.isedit = true;
      this.$nextTick(() => {});
    },
    overedit(node, data) {
      node.data.isedit = false;
    },
    save_organize_tree() {
      if (this.list) {
        OrgFun.saveorgtree(this.list).then(res => {
          this.gettree_data();
          this.dialogshow = false;
        });
      }
    },
    edit_organize_tree() {
      this.dialogshow = true;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    edit_nodeinfo() {
      const node = this.$refs.tree.getCurrentNode();
      if (node) {
        OrgFun.getnodeinfo(node.nodeid).then(res => {
          this.nodeform = res.node;
          this.formdialog = true;
        });
      }
    },
    update_nodeinfo() {
      OrgFun.updatenodeinfo(this.nodeform).then(res => {
        this.gettree_data();
        this.formdialog = false;
      });
    },
    uploadsuccess(response, file, fileList) {
      console.log(response);
      console.log(file);
      console.log(fileList);
      this.$notify.success({ title: file.name, message: response.msg });
    },
    uploaderror(err, file, fileList) {
      console.log(err);
      console.log(file);
      console.log(fileList);
      this.$notify.error({ title: file.name, message: err.msg });
    },
    beforeUpload(file) {
      console.log(file);
      const isJPG =
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const isLt4M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$notify.error({
          title: file.name,
          message: "上传文件只能是 xls或xlsx 格式!"
        });
      }
      if (!isLt4M) {
        this.$notify.error({
          title: file.name,
          message: "上传文件大小不能超过 4MB!"
        });
      }
      return isJPG && isLt4M;
    }
  }
};
</script>

<style lang="scss">
.operate_bar {
  padding: 5px;
}
.mytree {
  .el-tree-node__content {
    height: 30px;
  }
}
.myupload {
  display: inline;
  margin-left: 10px;
}
</style>