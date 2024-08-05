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
      <el-table-column prop="growthPoint" header-align="center" align="center" label="等级需要的成长值" />
      <el-table-column prop="isDefaultLevel" header-align="center" align="center" label="是否为默认等级" />
      <el-table-column prop="freeShippingThreshold" header-align="center" align="center" label="免运费标准" />
      <el-table-column prop="commentGrowthPoint" header-align="center" align="center" label="每次评价获取的成长值" />

      <el-table-column label="特权" align="center">
        <el-table-column prop="isFreeShipping" header-align="center" align="center" label="是否有免邮特权" />
        <el-table-column prop="isMemberPrice" header-align="center" align="center" label="是否有会员价格特权" />
        <el-table-column prop="isBirthdayPrivilege" header-align="center" align="center" label="是否有生日特权" />
      </el-table-column>

      <el-table-column prop="remark" header-align="center" align="center" label="备注" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data () {
    return {
      loading: false,
      dataSource: [],
      queryModel: {
        key: ''
      },
      url: {
        list: '/member/level/listPage'
      },
      pageIndex: 1,
      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      totalPage: 0
    }
  },
  created () { },
  methods: {
    handleAdd () {

    },
    handleEdit () {

    },
    handleDelete () {

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
        params: this.$http.adornParams({ queryParams })
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