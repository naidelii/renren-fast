<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-steps :active="step" finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="规格参数"></el-step>
          <el-step title="销售属性"></el-step>
          <el-step title="SKU信息"></el-step>
          <el-step title="保存完成"></el-step>
        </el-steps>
      </el-col>
      <el-col :span="24">
        <component :is="currentComponent" :spu-model="spuModel" @previous-step="previousStep()" @next-step="nextStep()" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import spuBaseInfo from './modules/spuBaseInfo'
import spuAttrParams from './modules/spuAttrParams'
import spuSaleAttrs from './modules/spuSaleAttrs'

export default {
  name: 'spuAdd',
  components: {
    spuBaseInfo,
    spuAttrParams,
    spuSaleAttrs
  },
  data () {
    return {
      step: 0,
      spuModel: {
        spuName: '',
        description: '',
        categoryId: '',
        brandId: '',
        weight: '',
        bounds: {},
        baseAttrs: []
      },
      url: {
      }
    }
  },
  computed: {
    currentComponent () {
      switch (this.step) {
        case 0:
          return 'spuBaseInfo'
        case 1:
          return 'spuAttrParams'
        case 2:
          return 'spuSaleAttrs'
        default:
          return 'SpuBaseInfo'
      }
    }
  },
  watch: {

  },
  created () { },

  methods: {
    // 下一页
    nextStep () {
      this.step++
    },
    // 上一页
    previousStep () {
      this.step--
    }
  }
}
</script>

<style scoped>
</style>