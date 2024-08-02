<template>
  <el-cascader
    filterable
    clearable
    placeholder="试试搜索：手机"
    v-model="paths"
    :options="dataSource"
    :props="defaultProps"
  />
</template>

<script>
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  // 接受父组件传来的值
  props: {
    categoryPath: {
      type: Array,
      default: () => []
    }
  },
  data () {
    // 这里存放数据
    return {
      defaultProps: {
        children: 'children',
        value: 'id',
        label: 'categoryName'
      },
      dataSource: [],
      paths: this.categoryPath
    }
  },
  watch: {
    categoryPath (newPath) {
      this.$emit('update:categoryPath', newPath)
    },
    paths (newPath) {
      this.$emit('update:categoryPath', newPath)
    }
  },
  // 方法集合
  methods: {
    getList () {
      this.$http({
        url: this.$http.adornUrl('/product/category/listWithTree'),
        method: 'get'
      }).then(({ data }) => {
        this.dataSource = data.data
      })
    },
    clearInput () {
      console.log('clearInput')
      // 清空 categoryPath
      this.paths = []
      // this.$emit('update:categoryPath', [])
    }
  },
  created () {
    this.getList()
  }
}
</script>
<style scoped>
</style>