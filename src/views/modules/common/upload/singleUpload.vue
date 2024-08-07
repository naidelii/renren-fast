<template>
  <div>
    <el-upload
      :action="uploadAction"
      :data="dataObj"
      list-type="picture"
      :multiple="false"
      :show-file-list="showFileList"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { policy } from './policy'

export default {
  name: 'singleUpload',
  props: {
    value: String
  },
  computed: {
    imageUrl () {
      console.log('this.value', this.value)
      return this.value
    },
    imageName () {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf('/') + 1)
      } else {
        return null
      }
    },
    fileList () {
      let arr = [{
        name: this.imageName,
        url: this.imageUrl
      }]
      return arr
    },
    showFileList: {
      get: function () {
        return this.value !== null && this.value !== '' && this.value !== undefined
      },
      set: function (newValue) {
      }
    }
  },
  data () {
    return {
      uploadAction: 'http://192.168.230.7:9000/gongshanglian',
      // 文件上传至哪个文件夹
      dirName: 'brand',
      dataObj: {
        // 凭证token
        'policy': '',
        // 签名算法
        'x-amz-algorithm': '',
        // 认证授权
        'x-amz-credential': '',
        // 时间戳
        'x-amz-date': '',
        // 签名
        'x-amz-signature': '',
        // 验证的参数
        'key': ''
      },
      dialogVisible: false
    }
  },
  methods: {
    emitInput (val) {
      this.$emit('input', val)
    },
    handleRemove (file, fileList) {
      this.emitInput('')
    },
    handlePreview (file) {
      this.dialogVisible = true
    },
    // 上传前
    beforeUpload (file) {
      let fileName = file.name
      let _that = this
      return new Promise((resolve, reject) => {
        policy(_that.dirName, fileName).then(resp => {
          if (resp.code === 200) {
            _that.dataObj = resp.data
          }
          resolve(true)
        }).catch(e => {
          // 传递一个 Error 对象
          reject(new Error('Failed to get policy'))
        })
      })
    },
    handleUploadSuccess (res, file) {
      this.showFileList = true
      this.fileList.pop()
      let obj = {
        name: file.name,
        url: this.uploadAction + this.dataObj.key
      }
      this.fileList.push(obj)
      this.emitInput(this.fileList[0].url)
    }
  }
}
</script>
<style>
</style>
