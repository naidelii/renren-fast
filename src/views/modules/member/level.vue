<template>
  <div class="mod-config">
    <el-form :inline="true" :model="queryModel">
      <el-form-item>
        <el-input v-model="queryModel.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getList()">查询</el-button>
        <el-button type="primary" @click="handleAdd()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataSource" border v-loading="loading" style="width: 100%">
      <el-table-column prop="id" header-align="center" align="center" label="id" />
      <el-table-column prop="name" header-align="center" align="center" label="等级名称" />
      <el-table-column prop="growthPoint" header-align="center" align="center" label="所需成长值" />

      <el-table-column prop="isDefaultLevel" header-align="center" align="center" label="默认等级">
        <template slot-scope="{ row }">
          <i :class="row.isDefaultLevel === 1 ? 'el-icon-success' : 'el-icon-error'"></i>
        </template>
      </el-table-column>

      <el-table-column prop="freeShippingThreshold" header-align="center" align="center" label="免运费标准" />
      <el-table-column prop="commentGrowthPoint" header-align="center" align="center" label="每次评价获取的成长值" />

      <el-table-column label="特权" align="center">
        <el-table-column prop="isFreeShipping" header-align="center" align="center" label="免邮特权">
          <template slot-scope="{ row }">
            <i :class="row.isFreeShipping === 1 ? 'el-icon-success' : 'el-icon-error'"></i>
          </template>
        </el-table-column>

        <el-table-column prop="isMemberPrice" header-align="center" align="center" label="会员价格特权">
          <template slot-scope="{ row }">
            <i :class="row.isMemberPrice === 1 ? 'el-icon-success' : 'el-icon-error'"></i>
          </template>
        </el-table-column>
        <el-table-column prop="isBirthdayPrivilege" header-align="center" align="center" label="生日特权">
          <template slot-scope="{ row }">
            <i :class="row.isBirthdayPrivilege === 1 ? 'el-icon-success' : 'el-icon-error'"></i>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column prop="remark" header-align="center" align="center" label="备注" />

      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="handleEdit(row.id)">修改</el-button>
          <el-button type="text" size="small" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update ref="addOrUpdate" @refreshDataList="getList" />
  </div>
</template>

<script>
import addOrUpdate from './level-add-or-update.vue'

export default {
  name: 'level',
  components: {
    addOrUpdate
  },
  data () {
    return {
      loading: false,
      dataSource: [],
      queryModel: {
        key: ''
      },
      url: {
        list: '/member/level/listPage',
        delete: '/member/level/delete'
      },
      pageIndex: 1,
      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      totalPage: 0
    }
  },
  created () {
    this.getList()
  },
  methods: {
    handleAdd () {
      this.$refs.addOrUpdate.title = '添加'
      this.$refs.addOrUpdate.add()
    },
    handleEdit (id) {
      this.$refs.addOrUpdate.title = '编辑'
      this.$refs.addOrUpdate.edit(id)
    },
    handleDelete (id) {
      const isBatchDelete = !id
      const confirmMessage = `确定对[id=${id}]进行[${isBatchDelete ? '批量删除' : '删除'}]操作?`
      this.$confirm(confirmMessage, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.$http({
          url: this.$http.adornUrl(this.url.delete),
          method: 'post',
          data: this.$http.adornData({ id })
        })
      }).then(({ data }) => {
        if (data.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getList()
            }
          })
        } else {
          this.$message.error(data.message || '请求失败')
        }
      }).catch(error => {
        throw new Error(error.msg || '删除失败')
      })
    },
    getList () {
      this.loading = true
      const queryParams = {
        'page': this.pageIndex,
        'limit': this.pageSize,
        ...this.queryModel
      }
      this.$http({
        url: this.$http.adornUrl(this.url.list),
        method: 'get',
        params: this.$http.adornParams(queryParams)
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.dataSource = data.data.records
          this.totalPage = data.data.total
        } else {
          this.dataSource = []
          this.totalPage = 0
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
</style>