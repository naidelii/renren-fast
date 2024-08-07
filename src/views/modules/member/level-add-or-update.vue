<template>
  <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="170px">
      <el-form-item label="等级名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="等级名称"></el-input>
      </el-form-item>
      <el-form-item label="所需成长值" prop="growthPoint">
        <el-input-number v-model="dataForm.growthPoint" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="默认等级" prop="isDefaultLevel">
        <el-radio-group v-model="dataForm.isDefaultLevel">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="免运费标准" prop="freeShippingThreshold">
        <el-input-number :min="0" :precision="2" :step="1" v-model="dataForm.freeShippingThreshold" />
      </el-form-item>
      <el-form-item label="每次评价获取的成长值" prop="commentGrowthPoint">
        <el-input-number :min="0" v-model="dataForm.commentGrowthPoint"></el-input-number>
      </el-form-item>
      <el-form-item label="是否有免邮特权" prop="isFreeShipping">
        <el-checkbox v-model="dataForm.isFreeShipping" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>
      <el-form-item label="是否有会员价格特权" prop="isMemberPrice">
        <el-checkbox v-model="dataForm.isMemberPrice" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>
      <el-form-item label="是否有生日特权" prop="isBirthdayPrivilege">
        <el-checkbox v-model="dataForm.isBirthdayPrivilege" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
  name: '',
  components: {},
  data () {
    return {
      visible: false,
      title: '',
      dataForm: this.getDefaultDataForm(),
      dataRule: {
        name: [
          { required: true, message: '等级名称不能为空', trigger: 'blur' }
        ],
        growthPoint: [
          { required: true, message: '等级需要的成长值不能为空', trigger: 'blur' }
        ],
        isDefaultLevel: [
          { required: true, message: '是否为默认等级不能为空', trigger: 'blur' }
        ],
        freeShippingThreshold: [
          { required: true, message: '免运费标准不能为空', trigger: 'blur' }
        ],
        commentGrowthPoint: [
          { required: true, message: '每次评价获取的成长值不能为空', trigger: 'blur' }
        ],
        isFreeShipping: [
          { required: true, message: '是否有免邮特权不能为空', trigger: 'blur' }
        ],
        isMemberPrice: [
          { required: true, message: '是否有会员价格特权不能为空', trigger: 'blur' }
        ],
        isBirthdayPrivilege: [
          { required: true, message: '是否有生日特权不能为空', trigger: 'blur' }
        ]
      },
      url: {
        save: '/member/level/save',
        update: '/member/level/update',
        info: '/member/level/info'
      }
    }
  },
  created () { },
  methods: {
    getDefaultDataForm () {
      return {
        name: '',
        growthPoint: 0,
        isDefaultLevel: 0,
        freeShippingThreshold: 0.00,
        commentGrowthPoint: 0,
        isFreeShipping: 0,
        isMemberPrice: 0,
        isBirthdayPrivilege: 0,
        remark: ''
      }
    },
    add () {
      this.dataForm = this.getDefaultDataForm()
      this.visible = true
    },
    edit (id) {
      this.visible = true
      if (!id) {
        return
      }
      // 查询详情
      this.$http({
        url: this.$http.adornUrl(`${this.url.info}/${id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.dataForm = data.data
        } else {
          this.$message.error(data.msg)
        }
      }).catch(() => this.$message.error('请求失败，请稍后重试'))
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        const url = this.dataForm.id ? this.url.update : this.url.save
        this.$http({
          url: this.$http.adornUrl(url),
          method: 'post',
          data: this.$http.adornData(this.dataForm, false)
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        }).catch(() => this.$message.error('请求失败，请稍后重试'))
      })
    }
  }
}
</script>

<style scoped>
</style>