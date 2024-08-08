<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <category-tree @treeNodeClick="onTreeNodeClick" />
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
            <el-table-column type="selection" header-align="center" align="center" width="50" />
            <el-table-column prop="id" header-align="center" align="center" label="id" />
            <el-table-column prop="categoryName" header-align="center" align="center" label="所属分类" />
            <el-table-column prop="attrGroupName" header-align="center" align="center" label="所属分组" />
            <el-table-column prop="attrName" header-align="center" align="center" label="属性名" />

            <el-table-column prop="isSearch" header-align="center" align="center" label="是否需要检索">
              <template slot-scope="{ row }">
                <i :class="row.isSearch === 1 ? 'el-icon-success' : 'el-icon-error'"></i>
              </template>
            </el-table-column>

            <el-table-column prop="valueType" header-align="center" align="center" label="值类型">
              <template slot-scope="{ row }">
                <el-tag :type="row.valueType === 0 ? 'success' : ''">{{ row.valueType === 0 ? '单选' : '多选' }}</el-tag>
              </template>
            </el-table-column>

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

            <el-table-column prop="icon" header-align="center" align="center" label="图标" />
            <el-table-column prop="isEnable" header-align="center" align="center" label="是否启用">
              <template slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.isEnable == 1"></i>
                <i class="el-icon-error" v-else></i>
              </template>
            </el-table-column>

            <el-table-column prop="isQuickShow" header-align="center" align="center" label="是否快速展示">
              <template slot-scope="{ row }">
                <i :class="row.isQuickShow === 1 ? 'el-icon-success' : 'el-icon-error'"></i>
              </template>
            </el-table-column>

            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
              <template slot-scope="{ row }">
                <el-button type="text" size="small" @click="handleEdit(row.id)">修改</el-button>
                <el-button type="text" size="small" @click="handleDelete(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdate" @refreshDataList="getList" />
  </div>
</template>

<script>
import categoryTree from '../common/categoryTree'
import addOrUpdate from './base-attr-add-or-update'
export default {
  components: {
    categoryTree,
    addOrUpdate
  },
  data () {
    return {
      dataSource: [],
      loading: false,
      queryModel: {
        categoryId: ''
      },
      url: {
        list: '/product/attr/base/listPage'
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    splitValueSelect (valueSelect) {
      return valueSelect ? valueSelect.split(';') : []
    },
    firstItem (valueSelect) {
      const items = this.splitValueSelect(valueSelect)
      return items.length > 0 ? items[0] : ''
    },
    // 树节点被点击
    onTreeNodeClick (data) {
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
    },
    handleAdd () {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init()
      })
    },
    reset () {
      this.queryModel = {}
      this.getList()
    },
    query () {
      this.getList()
    },
    handleEdit (id) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    }
  }
}
</script>

<style>
</style>