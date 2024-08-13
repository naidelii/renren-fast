<template>
  <div>
    <el-upload
      :action="uploadAction"
      :data="dataObj"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :on-success="handleUploadSuccess"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { policy } from './policy'
export default {
  name: 'multiUpload',
  components: {},
  // 接受父组件传来的值
  props: {
    dirPath: {
      type: String,
      default: 'default'
    }
  },
  data () {
    return {
      uploadAction: 'http://192.168.230.7:9000/gongshanglian',
      // 文件上传至哪个文件夹
      dirName: this.dirPath,
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
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  created () {
  },
  methods: {
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
            // 将后端的文件名复制给file对象
            file.fileName = resp.data.key
          }
          resolve(true)
        }).catch(e => {
          // 传递一个 Error 对象
          reject(new Error('Failed to get policy'))
        })
      })
    },
    handleUploadSuccess (response, file, fileList) {
      // 创建新的数组，提取每个文件的name并手动设置url
      const updatedFileList = fileList.map(item => {
        return {
          imageName: item.name,
          imageUrl: this.uploadAction + item.raw.fileName
        }
      })
      // 将数据传递给父组件
      this.$emit('uploadSuccess', updatedFileList)
    },
    handleRemove (file, fileList) {
    }
  }
}
</script>

<style scoped>
</style>