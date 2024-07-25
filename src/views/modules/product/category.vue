<template>
  <div>
    <el-button type="danger" @click="batchDelete">批量删除</el-button>
    <el-tree :data="dataSource" :props="defaultProps" :expand-on-click-node="false" show-checkbox node-key="id" :default-expanded-keys="expandedKey" ref="menuTree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }} </span>
        <span>
          <el-button v-if="node.level <= 2" type="text" size="mini" @click="() => add(data)">新增</el-button>
          <el-button type="text" size="mini" @click="edit(data)">修改</el-button>
          <el-button v-if="node.childNodes.length == 0" type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="dataForm">
        <el-form-item label="分类名称">
          <el-input v-model="dataForm.categoryName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="dataForm.img" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      expandedKey: [],
      dialogVisible: false,
      title: '',
      dialogType: '', // edit,add
      dataForm: this.getDefaultDataForm(),
      /* 数据源 */
      dataSource: [],
      defaultProps: {
        children: 'children',
        label: 'categoryName'
      },
      url: {
        list: '/product/category/listWithTree',
        save: '/product/category/save',
        update: '/product/category/update',
        deleteBatch: '/product/category/deleteBatch'
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getDefaultDataForm () {
      return {
        id: null,
        categoryName: '',
        parentId: '',
        sortOrder: 0,
        level: 0,
        img: ''
      }
    },
    getList () {
      this.$http({
        url: this.$http.adornUrl(this.url.list),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data.code === 200) {
          this.dataSource = data.data
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    add (data) {
      this.resetDialog('add', '添加分类', { parentId: data.id, level: data.level + 1 })
    },
    edit (data) {
      this.resetDialog('edit', '编辑分类', data)
    },
    resetDialog (type, title, formData = {}) {
      this.dialogType = type
      this.title = title
      this.dataForm = { ...this.getDefaultDataForm(), ...formData }
      this.dialogVisible = true
    },
    remove (node, data) {
      this.$confirm(`是否删除[${data.categoryName}]菜单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = [data.id]
        this.$http({
          url: this.$http.adornUrl(this.url.deleteBatch),
          method: 'post',
          data: ids
        }).then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              message: data.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getList()
                this.expandedKey = [node.parent.data.id]
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => { })
    },
    submitData () {
      console.log('提交的三级分类数据', this.dataForm)
      let url = ''
      if (this.dialogType === 'add') {
        url = this.url.save
      } else {
        url = this.url.update
      }
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'post',
        data: this.$http.adornData(this.dataForm, false)
      }).then(({ data }) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        // 关闭对话框
        this.dialogVisible = false
        // 刷新出新的菜单
        this.getList()
        // 设置需要默认展开的菜单
        this.expandedKey = [this.dataForm.parentId]
      })
    },
    batchDelete () {
      let selectIds = this.$refs.menuTree.getCheckedKeys()
      this.$confirm(`是否批量删除【${selectIds}】菜单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(this.url.deleteBatch),
          method: 'post',
          data: selectIds
        }).then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              message: data.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {

      })
    }
  }
}
</script>
<style scoped></style>
