<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <category-tree @treeNodeClick="treeNodeClick" />
      </el-col>
      <el-col :span="18">
        <div>
          <el-form :inline="true" :model="queryModel">
            <el-form-item>
              <el-input v-model="queryModel.key" placeholder="参数名" clearable />
            </el-form-item>
            <el-form-item>
              <el-button @click="query()">查询</el-button>
              <el-button @click="reset()">重置</el-button>
              <el-button type="primary" @click="handleAdd()">新增</el-button>
            </el-form-item>
          </el-form>
          <el-table v-loading="loading" :data="dataSource" style="width: 100%">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column prop="id" header-align="center" align="center" label="分组id"></el-table-column>
            <el-table-column prop="categoryId" header-align="center" align="center" label="所属分类id"></el-table-column>
            <el-table-column prop="groupName" header-align="center" align="center" label="组名"></el-table-column>
            <el-table-column prop="sortOrder" header-align="center" align="center" label="排序"></el-table-column>
            <el-table-column prop="description" header-align="center" align="center" label="描述"></el-table-column>
            <el-table-column prop="icon" header-align="center" align="center" label="组图标"></el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleEdit(scope.row.id)">修改</el-button>
                <el-button type="text" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <add-or-update ref="addOrUpdate" @refreshDataList="getList" />
  </div>
</template>

<script>
import categoryTree from '../common/categoryTree'
import addOrUpdate from './attrgroup-add-or-update.vue'
export default {
  components: {
    categoryTree,
    addOrUpdate
  },
  data () {
    return {
      dataSource: [],
      loading: false,
      catelogPath: [],
      queryModel: {
        key: '',
        categoryId: ''
      },
      url: {
        list: '/product/attrGroup/listPage',
        delete: '/product/attrGroup/delete'
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    reset () {
      this.queryModel = {}
      this.getList()
    },
    handleAdd () {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
      })
    },
    handleEdit (id) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    handleDelete (id) {
      this.$confirm(`确定对[id=${id}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(this.url.delete),
          method: 'post',
          params: this.$http.adornParams({id: id})
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message({
              message: '操作成功',
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
      })
    },
    query () {
      this.getList()
    },
    // 树节点被点击
    treeNodeClick (data) {
      this.queryModel.categoryId = data.id
      this.getList()
    },
    getList () {
      this.loading = true
      this.$http({
        url: this.$http.adornUrl(this.url.list),
        method: 'get',
        params: this.$http.adornParams(this.queryModel)
      }).then(({ data }) => {
        if (data.code === 200) {
          this.dataSource = data.data.records
        } else {
          this.$message.error(data.msg)
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>
</style>