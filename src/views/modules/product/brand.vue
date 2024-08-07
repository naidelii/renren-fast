<template>
  <div class="mod-config">
    <el-form :inline="true" :model="query" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="query.brandName" placeholder="品牌名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"> </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" label="品牌id"> </el-table-column>
      <el-table-column prop="brandName" header-align="center" align="center" label="品牌名称"> </el-table-column>
      <el-table-column prop="logoUrl" header-align="center" align="center" label="品牌logo">
        <template slot-scope="{ row }">
          <el-image :src="row.logoUrl" fit="fill" />
        </template>
      </el-table-column>
      <el-table-column prop="description" header-align="center" align="center" label="介绍"> </el-table-column>

      <el-table-column prop="isShow" header-align="center" align="center" label="是否显示">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isShow"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateBrandStatus(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column prop="firstLetter" header-align="center" align="center" label="检索首字母"> </el-table-column>
      <el-table-column prop="sortOrder" header-align="center" align="center" label="排序"> </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateCatelogHandle(scope.row.id)">关联分类</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
    <!-- 关联分类组件 -->
    <associative-classification ref="associativeClassification" />
  </div>
</template>

<script>
import addOrUpdate from './brand-add-or-update'
import associativeClassification from '../common/associativeClassification'
export default {
  components: {
    addOrUpdate,
    associativeClassification
  },
  data () {
    return {
      query: {
        brandName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      url: {
        list: '/product/brand/listPage',
        deleteBatch: '/product/brand/deleteBatch',
        update: '/product/brand/update'
      }
    }
  },

  created () {
    this.getDataList()
  },
  methods: {
    updateCatelogHandle (id) {
      this.$nextTick(() => {
        this.$refs.associativeClassification.init(id)
      })
    },
    updateBrandStatus (data) {
      console.log('updateBrandStatus', data)
      let { id, isShow } = data
      // 发送请求修改状态
      this.$http({
        url: this.$http.adornUrl(this.url.update),
        method: 'post',
        data: this.$http.adornData({ id, isShow }, false)
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message({
            type: 'success',
            message: data.msg
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl(this.url.list),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'brandName': this.query.brandName
        })
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.dataList = data.data.records
          this.totalPage = data.data.total
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(this.url.deleteBatch),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  }
}
</script>
