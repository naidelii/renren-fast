<template>
  <div>
    <el-tree :data="dataSource" :props="defaultProps" :expand-on-click-node="false" node-key="id" ref="menuTree" @node-click="nodeClick"> </el-tree>
  </div>
</template>

<script>
export default {
  name: 'categoryTree',
  data () {
    return {
      /* 数据源 */
      dataSource: [],
      defaultProps: {
        children: 'children',
        label: 'categoryName'
      },
      url: {
        list: '/product/category/listWithTree'
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
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
    nodeClick (data, node, component) {
      // 第三级才调用父组件
      if (data.level === 3) {
        this.$emit('treeNodeClick', data)
      }
    }
  }
}
</script>
<style scoped></style>
