<template>
  <div>
    <el-select placeholder="请选择" v-model="brandId" filterable clearable>
      <el-option v-for="item in dataSource" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'brandSelect',
  // 接受父组件传来的值
  props: {
    categoryId: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      // 发布订阅模型
      catPathSub: null,
      brandId: '',
      dataSource: [],
      url: {
        listByCategoryId: '/product/brand/listByCategoryId'
      }
    }
  },
  // 监控brandId的数据变化
  watch: {
    brandId (val) {
      this.PubSub.publish('brandId', val)
    }
  },
  created () {
  },
  mounted () {
    // 通过发布订阅模式来监听 'categoryPath'
    this.catPathSub = this.PubSub.subscribe('categoryPath', (msg, newPath) => {
      // 给当前分类id赋值
      const categoryId = newPath[newPath.length - 1]
      this.getList(categoryId)
    })
  },
  beforeDestroy () {
    this.PubSub.unsubscribe(this.catPathSub)
  },
  methods: {
    getList (categoryId) {
      this.$http({
        url: this.$http.adornUrl(this.url.listByCategoryId),
        method: 'get',
        params: this.$http.adornParams({
          categoryId: categoryId
        })
      }).then(({ data }) => {
        this.dataSource = data.data
      })
    }
  }
}
</script>

<style scoped>
</style>