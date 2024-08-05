<template>
  <div>
    <el-dialog :close-on-click-modal="false" :visible.sync="visible" width="60%">
      <el-dialog :title="title" :visible.sync="innerVisible" width="40%" append-to-body>
        <div>
          <el-table :data="dataList" style="width: 100%" @selection-change="innerSelectionChangeHandle">
            <el-table-column type="selection" header-align="center" align="center"></el-table-column>
            <el-table-column prop="id" label="属性id" width="180"> </el-table-column>
            <el-table-column prop="attrName" label="属性名" width="100"> </el-table-column>
            <el-table-column prop="valueSelect" header-align="center" align="center" label="可选值">
              <template slot-scope="{ row }">
                <el-tooltip placement="top" v-if="row.valueSelect">
                  <template slot="content">
                    <div>
                      <span v-for="(item, index) in splitValueSelect(row.valueSelect)" :key="index">{{ item }}<br /></span>
                    </div>
                  </template>
                  <el-tag>{{ firstItem(row.valueSelect) }} ...</el-tag>
                </el-tooltip>
                <span v-else>无</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddRealtion">确认新增</el-button>
        </div>
      </el-dialog>

      <el-row>
        <el-col :span="24">
          <el-button type="primary" @click="handleAdd">新建关联</el-button>
          <el-table v-loading="loading" :data="dataSource" style="width: 100%">
            <el-table-column prop="id" label="id" width="180"> </el-table-column>
            <el-table-column prop="attrName" label="属性名" width="100"> </el-table-column>
            <el-table-column prop="valueSelect" header-align="center" align="center" label="可选值">
              <template slot-scope="{ row }">
                <el-tooltip placement="top" v-if="row.valueSelect">
                  <template slot="content">
                    <div>
                      <span v-for="(item, index) in splitValueSelect(row.valueSelect)" :key="index">{{ item }}<br /></span>
                    </div>
                  </template>
                  <el-tag>{{ firstItem(row.valueSelect) }} ...</el-tag>
                </el-tooltip>
                <span v-else>无</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="120" label="操作">
              <template slot-scope="{ row }">
                <el-button type="text" size="small" @click="handleRemove(row.id)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'attrgroupRelation',
  components: {},
  data () {
    return {
      innerVisible: false,
      visible: false,
      title: '选择属性',
      loading: false,
      dataSource: [],
      dataList: [],
      innerdataListSelections: [],
      url: {
        list: '/product/attrGroup/listAttrGroupsWithAttributes',
        deleteAttrRelation: '/product/attrGroup/deleteAttrRelation',
        listUnrelatedAttributes: '/product/attrGroup/listUnrelatedAttributes',
        addAttributeToGroup: '/product/attrGroup/addAttributeToGroup'
      },
      dataForm: {
        attrGroupId: '',
        categoryId: ''
      },
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  created () { },
  methods: {
    init (attrGroupId, categoryId) {
      this.visible = true
      this.dataForm.attrGroupId = attrGroupId
      this.dataForm.categoryId = categoryId
      this.getList()
    },
    handleAdd () {
      this.innerVisible = true
      this.getUnrelatedList()
    },
    getUnrelatedList () {
      this.$http({
        url: this.$http.adornUrl(this.url.listUnrelatedAttributes),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'attrGroupId': this.dataForm.attrGroupId,
          'categoryId': this.dataForm.categoryId
        })
      }).then(({ data }) => {
        if (data.code === 200) {
          this.dataList = data.data.records
          this.totalPage = data.data.total
        } else {
          this.$message.error(data.msg)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getList () {
      this.loading = true
      this.$http({
        url: this.$http.adornUrl(this.url.list),
        method: 'get',
        params: this.$http.adornParams({ attrGroupId: this.dataForm.attrGroupId })
      }).then(({ data }) => {
        if (data.code === 200) {
          this.dataSource = data.data
        } else {
          this.$message.error(data.msg)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    splitValueSelect (valueSelect) {
      return valueSelect ? valueSelect.split(';') : []
    },
    firstItem (valueSelect) {
      const items = this.splitValueSelect(valueSelect)
      return items.length > 0 ? items[0] : ''
    },
    handleRemove (id) {
      const reqData = {
        'attrId': id,
        'attrGroupId': this.dataForm.attrGroupId
      }
      this.$confirm(`确定对[id=${id}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(this.url.deleteAttrRelation),
          method: 'post',
          data: this.$http.adornData(reqData)
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
      }).catch(() => { })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getUnrelatedList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getUnrelatedList()
    },
    innerSelectionChangeHandle (val) {
      console.log('innerSelectionChangeHandle', val)
      this.innerdataListSelections = val
    },
    submitAddRealtion () {
      if (this.innerdataListSelections.length === 0) {
        this.$message.error('当前并未选择要添加的属性')
        return
      }
      this.innerVisible = false
      const attrIds = this.innerdataListSelections.map(attribute => attribute.id)
      const reqData = {
        attrIds: attrIds,
        attrGroupId: this.dataForm.attrGroupId
      }
      this.$http({
        url: this.$http.adornUrl(this.url.addAttributeToGroup),
        method: 'post',
        data: this.$http.adornData(reqData)
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
    }
  }
}
</script>

<style scoped>
</style>