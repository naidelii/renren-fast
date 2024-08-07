<template>
  <el-card class="box-card" style="width: 80%; margin: 20px auto">
    <el-form ref="spuBaseForm" :model="spuModel" label-width="120px" :rules="spuRules">
      <el-form-item label="商品名称" prop="spuName">
        <el-input v-model="spuModel.spuName"></el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="description">
        <el-input v-model="spuModel.description"></el-input>
      </el-form-item>
      <el-form-item label="选择分类" prop="categoryId">
        <category-cascader />
      </el-form-item>
      <el-form-item label="选择品牌" prop="brandId">
        <brand-select />
      </el-form-item>
      <el-form-item label="商品重量(Kg)" prop="weight">
        <el-input-number v-model="spuModel.weight" :min="0" :precision="3" :step="0.1"></el-input-number>
      </el-form-item>
      <el-form-item label="设置积分" prop="bounds">
        <label>金币</label>
        <el-input-number
          style="width: 130px"
          placeholder="金币"
          v-model="spuModel.bounds.buyBounds"
          :min="0"
          controls-position="right"
        ></el-input-number>
        <label style="margin-left: 15px">成长值</label>
        <el-input-number style="width: 130px" placeholder="成长值" v-model="spuModel.bounds.growBounds" :min="0" controls-position="right">
          <template slot="prepend">成长值</template>
        </el-input-number>
      </el-form-item>
      <el-form-item label="商品介绍" prop="decript">
        <multi-upload v-model="spuModel.decript"></multi-upload>
      </el-form-item>
      <el-form-item label="商品图集" prop="images">
        <multi-upload v-model="spuModel.images"></multi-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="nextStep">下一步：设置基本参数</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import categoryCascader from '../../common/categoryCascader'
import brandSelect from '../../common/brandSelect'
import multiUpload from '../../common/upload/multiUpload'

export default {
  name: '',
  components: {
    categoryCascader,
    brandSelect,
    multiUpload
  },
  props: {
    spuModel: Object,
    default: {}
  },
  data () {
    return {
      // 发布订阅
      catPathSub: null,
      brandIdSub: null,

      spuRules: {
        spuName: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '商品分类不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // 通过发布订阅模式来监听 'categoryPath'
    this.catPathSub = this.PubSub.subscribe('categoryPath', (msg, newPath) => {
      this.spuModel.categoryId = newPath[newPath.length - 1]
    })
    this.brandIdSub = this.PubSub.subscribe('brandId', (msg, val) => {
      this.spuModel.brandId = val
    })
  },
  beforeDestroy () {
    this.PubSub.unsubscribe(this.catPathSub)
    this.PubSub.unsubscribe(this.brandIdSub)
  },
  created () { },

  methods: {
    nextStep () {
      this.$refs.spuBaseForm.validate(valid => {
        if (valid) {
          this.$emit('next-step')
        }
      })
    }
  }
}
</script>

<style scoped>
</style>