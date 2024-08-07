<template>
  <el-cascader filterable clearable placeholder="试试搜索：手机" v-model="paths" :options="dataSource" :props="defaultProps" />
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
      // 接收第一次传过来的数据
      paths: this.categoryPath
    }
  },
  watch: {
    // 监听父组件的变化，用于清空
    categoryPath (newPath) {
      this.paths = newPath
    },
    // 监听子组件的变化，修改后将变化传递给父组件
    paths (newPath) {
      // 将 newPath 的值传递给父组件，从而更新父组件中的 categoryPath 值。
      this.$emit('update:categoryPath', newPath)
      // 通过pubsub-js进行传值
      this.PubSub.publish('categoryPath', newPath)
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
    }
  },
  created () {
    this.getList()
  }
}
</script>
<style scoped>
</style>