<template>
  <el-card class="box-card" style="width: 80%; margin: 20px auto">
    <el-form ref="spuBaseForm" :model="spuModel" label-width="120px" :rules="spuRules">
      <el-form-item label="商品名称" prop="spuName">
        <el-input v-model="spuModel.spuName"></el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="description">
        <el-input v-model="spuModel.shortDescription"></el-input>
      </el-form-item>
      <el-form-item label="选择分类" prop="categoryId">
        <category-cascader />
      </el-form-item>
      <el-form-item label="选择品牌" prop="brandId">
        <brand-select />
      </el-form-item>
      <el-form-item label="商品详情" prop="decript">
        <editor ref="editor"/>
      </el-form-item>
      <el-form-item label="商品图集" prop="images">
        <multi-upload v-model="spuModel.images" :dirPath="dirPath" @uploadSuccess="handleImagesUploadSuccess"></multi-upload>
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
import editor from '../../common/editor.vue'

export default {
  name: '',
  components: {
    categoryCascader,
    brandSelect,
    multiUpload,
    editor
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
      // 图片保存路径
      dirPath: 'spu',
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
    handleImagesUploadSuccess (fileList) {
      this.spuModel.imageList = fileList
    },
    nextStep () {
      console.log('this.spuModel', this.spuModel)
      // this.$refs.spuBaseForm.validate(valid => {
      //   if (valid) {
      //     this.$emit('next-step')
      //   }
      // })
    }
  }
}
</script>

<style scoped>
</style>