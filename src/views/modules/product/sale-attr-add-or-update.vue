<template>
  <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="属性名" prop="attrName">
        <el-input v-model="dataForm.attrName" placeholder="属性名" />
      </el-form-item>
      <el-form-item label="属性类型" prop="attrType">
        <el-select v-model="dataForm.attrType" placeholder="请选择">
          <el-option label="规格参数" :value="1"></el-option>
          <el-option label="销售属性" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <category-cascader ref="categoryCascader" :categoryPath.sync="categoryPath" />
      </el-form-item>
      <el-form-item label="属性图标" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="属性图标" />
      </el-form-item>
      <el-form-item label="值类型" prop="valueType">
        <el-radio-group v-model="dataForm.valueType">
          <el-radio :label="0">允许单个值</el-radio>
          <el-radio :label="1">允许多个值</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可选值" prop="valueSelect">
        <el-select v-model="valueSelects" multiple filterable allow-create placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="可检索" prop="isSearch">
        <el-switch v-model="dataForm.isSearch" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="启用状态" prop="enable">
        <el-switch
          v-model="dataForm.enable"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
      <el-form-item label="快速展示" prop="isShow">
        <el-switch
          v-model="dataForm.isShow"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import categoryCascader from '../common/categoryCascader'

export default {
  components: {
    categoryCascader
  },
  data () {
    return {
      visible: false,
      title: '',
      url: {
        info: '/product/attr/info',
        listByCategoryId: '/product/attrGroup/listByCategoryId',
        save: '/product/attr/save',
        update: '/product/attr/update'
      },
      dataRule: {
        attrName: [
          { required: true, message: '属性名不能为空', trigger: 'blur' }
        ],
        attrType: [
          { required: true, message: '属性类型不能为空', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '所属分类不能为空', trigger: 'blur' }
        ]
      },
      dataForm: {},
      categoryPath: [],
      valueSelects: []
    }
  },
  watch: {
    // 监听 categoryPath 的变化
    categoryPath (newPath) {
      if (!Array.isArray(newPath)) {
        this.$message.error('分类路径格式不正确')
        return
      }
      const length = newPath.length
      if (length === 3) {
        let categoryId = newPath[length - 1]
        this.dataForm.categoryId = categoryId
      } else if (length === 0) {
        this.dataForm.categoryId = ''
      } else {
        this.$message.error('请选择正确的分类')
      }
    }
  },
  methods: {
    init (id) {
      if (id) {
        this.edit(id)
      } else {
        this.add()
      }
    },
    add () {
      // this.$nextTick(() => {
      // // 清空 categoryCascader 组件的内部状态
      //   this.$refs.categoryCascader.clearInput()
      // })
      this.resetData('添加')
    },
    edit (id) {
      this.$http({
        url: this.$http.adornUrl(`${this.url.info}/${id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 200) {
          // 使用对象解构和剩余操作符去除 categoryIds
          const { categoryPath, valueSelect, ...dataModel } = data.data
          this.resetData('编辑', dataModel)
          this.categoryPath = categoryPath
          this.valueSelects = valueSelect.split(';')
        }
      })
    },

    resetData (title, formData = {}) {
      this.categoryPath = []
      this.valueSelects = []
      this.title = title
      this.dataForm = { ...this.getDefaultDataForm(), ...formData }
      this.visible = true
    },
    getDefaultDataForm () {
      return {
        id: null,
        attrName: '',
        categoryId: '',
        icon: '',
        attrType: 0,
        valueType: 0,
        isSearch: 0,
        isShow: 0,
        enable: 0
      }
    },
    dataFormSubmit () {
      let that = this
      const url = this.dataForm.id ? that.url.update : that.url.save
      const valueSelect = this.valueSelects.join(';')
      const reqData = {
        ...this.dataForm,
        valueSelect: valueSelect
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          that.$http({
            url: that.$http.adornUrl(url),
            method: 'post',
            data: this.$http.adornData(reqData, false)
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
