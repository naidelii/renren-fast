<template>
  <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="品牌名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="品牌名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌logo" prop="logo">
        <el-input v-model="dataForm.logo" placeholder="品牌logo"></el-input>
      </el-form-item>
      <el-form-item label="介绍" prop="description">
        <el-input v-model="dataForm.description" placeholder="介绍"></el-input>
      </el-form-item>
      <el-form-item label="是否显示" prop="isShow">
        <el-switch v-model="dataForm.isShow" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"/> 
      </el-form-item>
      <el-form-item label="排序值" prop="sortOrder">
        <el-input v-model="dataForm.sortOrder" placeholder="排序值"></el-input>
      </el-form-item>
      <el-form-item label="检索首字母" prop="firstLetter">
        <el-input v-model="dataForm.firstLetter" placeholder="检索首字母"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: this.getDefaultDataForm(),
      title: '',
      dataRule: {
        name: [
          { required: true, message: '品牌名称不能为空', trigger: 'blur' }
        ],
        isShow: [
          { required: true, message: '是否显示（不能为空', trigger: 'blur' }
        ]
      },
      url: {
        info: '/product/brand/info',
        save: '/product/brand/save',
        update: '/product/brand/update'
      }
    }
  },
  methods: {
    getDefaultDataForm () {
      return {
        id: null,
        name: '',
        logo: '',
        description: '',
        isShow: 0,
        sortOrder: 0,
        firstLetter: ''
      }
    },
    resetData (title, formData = {}) {
      this.title = title
      this.dataForm = { ...this.getDefaultDataForm(), ...formData }
      this.visible = true
    },
    add () {
      this.resetData('添加品牌')
    },
    edit (id) {
      this.$http({
        url: this.$http.adornUrl(`${this.url.info}/${id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.resetData('编辑品牌', data.data)
        }
      })
    },
    init (id) {
      if (id) {
        this.edit(id)
      } else {
        this.add()
      }
    },
    // 表单提交
    dataFormSubmit () {
      let that = this
      const url = this.dataForm.id ? that.url.update : that.url.save
      that.$refs['dataForm'].validate((valid) => {
        if (valid) {
          that.$http({
            url: that.$http.adornUrl(url),
            method: 'post',
            data: this.$http.adornData(that.dataForm, false)
          }).then(({ data }) => {
            if (data && data.code === 200) {
              that.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  that.visible = false
                  that.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
