<template>
  <div>
    <div class="operate_bar">
      <el-input v-model="key" placeholder="输入关键字进行过滤" size="small" style="width:200px;"></el-input>
      <el-button type="primary" size="small" icon="el-icon-edit" @click="edit_organize_tree">编辑节点树</el-button>
      <el-button type="success" size="small" icon="el-icon-info" @click="edit_nodeinfo">编辑节点信息</el-button>
    </div>
    <el-row>
      <el-col :span="6">
        <el-tree
          :data="list"
          node_key="id"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          ref="tree"
          highlight-current
        ></el-tree>
      </el-col>
      <el-col :span="18">
        <el-table :data="orguserlist">
          <el-table-column label="姓名"></el-table-column>
          <el-table-column label="代号"></el-table-column>
          <el-table-column label="性别"></el-table-column>
          <el-table-column label="电话"></el-table-column>
          <el-table-column label="身份证"></el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog title="组织节点树" :visible.sync="dialogshow" top="10px" @opened="dialog_opened_handle">
      <div class="mytree">
        <el-tree :data="list" node-key="id" default-expand-all :expand-on-click-node="false">
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
        <el-form-item label="节点名称">
          <el-input v-model="nodeform.name" placeholder="节点名称"></el-input>
        </el-form-item>
        <el-form-item label="节点类型">
          <el-select v-model="nodeform.orgtype" placeholder="请选择节点">
            <el-option
              v-for="item in orgtype_options"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节点编码">
          <el-input v-model="nodeform.orgcode" placeholder="节点编码"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="nodeform.leader" placeholder="负责人"></el-input>
        </el-form-item>
        <el-form-item label="节点Logo">
          <el-input v-model="nodeform.logo" placeholder="节点Logo"></el-input>
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
import BaseFun from "@/api/baseinfo/index";
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
      orgtype_options: [],
      orguserlist: []
    };
  },
  watch: {
    key(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.get_tree_all();
    this.getorgtypes();
  },
  methods: {
    loadnode(node, resolve) {
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
    get_tree_all() {
      OrgFun.all_tree_nodes(0).then(res => {
        this.list = res.result;
      });
    },
    getorgtypes() {
      BaseFun.orgtypelist().then(res => {
        this.orgtype_options = res.result;
      });
    },
    append(data) {
      OrgFun.createnode({
        id: data.id
      }).then(res => {
        const newChild = {
          id: res.result.id,
          isedit: false,
          parentid: data.id,
          label: res.result.name,
          orgcode: res.result.orgcode,
          orgtype: res.result.orgtype
        };
        if (!data.children) {
          this.$set(data, "children", []);
        }
        data.children.push(newChild);
      });
    },
    remove(node, data) {
      this.$confirm("你确定删除该节点?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          OrgFun.removenode({
            id: data.id
          })
            .then(res => {
              this.$message.info(res.msg);
              if (res.code === 1) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
              }
            })
            .catch(() => {});
        })
        .catch(() => {
          this.$message.info("操作已取消");
        });
    },
    add_rootnode() {
      OrgFun.createnode({
        id: 0
      }).then(res => {
        this.list.push({
          label: res.result.name,
          id: res.result.id,
          parentid: res.result.pid,
          isedit: false,
          orgtype: res.result.orgtype,
          orgcode: res.result.orgcode
        });
      });
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
        OrgFun.saveorgtree({ orgtree: this.list }).then(res => {
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
        OrgFun.getnodeinfo({ id: node.id }).then(res => {
          this.nodeform = res.result;
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
    dialog_opened_handle() {}
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