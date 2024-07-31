<template>
  <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="所属分类" prop="categoryIds">
        <!-- <el-input v-model="dataForm.categoryId" placeholder="所属分类id"></el-input>
         -->
        <el-cascader v-model="dataForm.categoryIds" filterable :props="props" :options="categorys" @change="handleChange" />
      </el-form-item>
      <el-form-item label="分组名称" prop="groupName">
        <el-input v-model="dataForm.groupName" placeholder="分组名称"></el-input>
      </el-form-item>
      <el-form-item label="介绍" prop="description">
        <el-input v-model="dataForm.description" placeholder="介绍"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="dataForm.icon" placeholder="图标"></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="sortOrder">
        <el-input v-model="dataForm.sortOrder" placeholder="排序值"></el-input>
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
      title: '',
      dataForm: {},
      url: {
        info: '/product/attrGroup/info',
        save: '/product/attrGroup/save',
        update: '/product/attrGroup/update'
      },
      dataRule: {
        categoryIds: [
          { required: true, message: '所属分类id不能为空', trigger: 'blur' }
        ],
        groupName: [
          { required: true, message: '分组名称不能为空', trigger: 'blur' }
        ]
      },
      categorys: [],
      props: {
        label: 'categoryName',
        value: 'id'
      }
    }
  },
  created () {
    this.getCategorys()
  },
  methods: {
    getCategorys () {
      this.$http({
        url: this.$http.adornUrl('/product/category/listWithTree'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data.code === 200) {
          this.categorys = data.data
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleChange () {

    },
    init (id) {
      if (id) {
        this.edit(id)
      } else {
        this.add()
      }
    },
    add () {
      this.resetData('添加')
    },
    edit (id) {
      this.$http({
        url: this.$http.adornUrl(`${this.url.info}/${id}`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.resetData('编辑', data.data)
        }
      })
    },
    resetData (title, formData = {}) {
      this.title = title
      this.dataForm = { ...this.getDefaultDataForm(), ...formData }
      this.visible = true
    },
    getDefaultDataForm () {
      return {
        id: null,
        categoryIds: [],
        groupName: '',
        description: '',
        icon: '',
        sortOrder: 0
      }
    },
    // 表单提交
    dataFormSubmit () {
      let that = this
      const url = this.dataForm.id ? that.url.update : that.url.save
       // 使用对象解构和剩余操作符去除 categoryIds
      const { categoryIds, ...restDataForm } = this.dataForm
      const reqData = {
        ...restDataForm,
        categoryId: categoryIds[categoryIds.length - 1]
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
