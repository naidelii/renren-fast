<template>
  <el-cascader filterable clearable placeholder="试试搜索：手机" v-model="paths" :options="dataSource" :props="defaultProps"> </el-cascader>
</template>

<script>
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  // 接受父组件传来的值
  props: {
    catelogPath: {
      type: Array,
      default () {
        return []
      }
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
      paths: this.catelogPath
    }
  },
  watch: {
    catelogPath (v) {
      console.log('catelogPath', v)
      this.paths = this.catelogPath
    },
    paths (v) {
      console.log('paths', v)
      this.$emit('update:catelogPath', v)
      // 还可以使用pubsub-js进行传值
      // this.PubSub.publish('catPath', v)
    }
  },
  // 方法集合
  methods: {
    getCategorys () {
      this.$http({
        url: this.$http.adornUrl('/product/category/listWithTree'),
        method: 'get'
      }).then(({ data }) => {
        this.dataSource = data.data
      })
    }
  },
  created () {
    this.getCategorys()
  }
}
</script>
<style scoped>
</style>