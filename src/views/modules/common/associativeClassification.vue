<template>
  <el-dialog title="关联分类" :visible.sync="dialogVisible" width="50%">
    <el-popover placement="right-end" v-model="popCatelogSelectVisible">
      <category-cascader :categoryPath.sync="categoryPath"></category-cascader>
      <div style="text-align: right; margin-top: 20px">
        <el-button size="mini" type="text" @click="popCatelogSelectVisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="addCatelogSelect">确定</el-button>
      </div>
      <el-button slot="reference">新增关联</el-button>
    </el-popover>

    <el-table :data="cateRelationTableData" style="width: 100%">
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="brandName" label="品牌名"></el-table-column>
      <el-table-column prop="categoryName" label="分类名"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleDelete(scope.row.id)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer" style="margin-top: 10px">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import categoryCascader from './categoryCascader'
export default {
  name: 'associativeClassification',
  components: {
    categoryCascader
  },
  data () {
    return {
      brandId: '',
      categoryId: '',
      categoryPath: [],
      dialogVisible: false,
      popCatelogSelectVisible: false,
      cateRelationTableData: [],
      url: {
        listByBrandId: '/product/categoryBrand/listByBrandId',
        delete: '/product/categoryBrand/delete'
      }
    }
  },
  watch: {
    // 监听 categoryPath 的变化
    categoryPath (newPath) {
      this.categoryId = newPath[newPath.length - 1]
    }
  },
  created () {

  },
  methods: {
    init (id) {
      this.dialogVisible = true
      this.brandId = id
      this.getList()
    },

    addCatelogSelect () {
      this.popCatelogSelectVisible = false
      const reqData = {
        brandId: this.brandId,
        categoryId: this.categoryId
      }
      this.$http({
        url: this.$http.adornUrl('/product/categoryBrand/save'),
        method: 'post',
        data: this.$http.adornData(reqData, false)
      }).then(({ data }) => {
        console.log('data', data)
        if (data && data.code === 200) {
          this.getList()
        } else {
          this.$message.error(data.msg)
        }
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
          params: this.$http.adornParams({ id: id })
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
      }).catch(() => {
        // 用户点击取消时，进入此处，不做任何操作
      })
    },
    getList () {
      this.$http({
        url: this.$http.adornUrl(this.url.listByBrandId),
        method: 'get',
        params: this.$http.adornParams({
          brandId: this.brandId
        })
      }).then(({ data }) => {
        this.cateRelationTableData = data.data
      })
    }
  }
}
</script>

<style>
</style>