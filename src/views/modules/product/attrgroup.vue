<template>
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
        </el-table>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import categoryTree from '../common/categoryTree'
export default {
  components: {
    categoryTree
  },
  data () {
    return {
      dataSource: [],
      loading: false,
      queryModel: {
        key: '',
        categoryId: ''
      },
      url: {
        list: '/product/attrGroup/listPage'
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    handleAdd () {

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