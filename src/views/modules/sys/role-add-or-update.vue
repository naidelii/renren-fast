<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色编码" prop="roleName">
        <el-input v-model="dataForm.roleCode" placeholder="角色编码"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-tree :data="menuList" :props="menuListTreeProps" node-key="id" ref="menuListTree" :default-expand-all="true" show-checkbox> </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
  data() {
    return {
      visible: false,
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataForm: {
        id: '',
        roleName: '',
        roleCode: '',
        description: ''
      },
      dataRule: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        roleCode: [{ required: true, message: '角色编码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async init(id) {
      this.resetForm()
      try {
        await this.fetchMenuList()
        this.visible = true
        await this.$nextTick()
        // 如果有id，说明是编辑
        if (id) {
          await this.fetchRoleInfo(id)
        }
      } catch (error) {
        console.error('Error initializing data:', error)
      }
    },

    async fetchMenuList() {
      const response = await this.$http({
        url: this.$http.adornUrl('/sys/permission/list'),
        method: 'get',
        params: this.$http.adornParams()
      })

      if (response && response.data) {
        this.menuList = treeDataTranslate(response.data.data, 'id')
      }
    },

    async fetchRoleInfo(roleId) {
      const response = await this.$http({
        url: this.$http.adornUrl(`/sys/role/info/${roleId}`),
        method: 'get',
        params: this.$http.adornParams()
      })

      if (response && response.data && response.data.code === 200) {
        const { id, roleName, description, permissionIds, roleCode } = response.data.data
        this.dataForm.id = id
        this.dataForm.roleName = roleName
        this.dataForm.description = description
        this.dataForm.roleCode = roleCode

        // Ensure menu tree is ready before setting checked keys
        await this.$nextTick()
        // this.$refs.menuListTree.setCheckedKeys(menuIdList);
        this.defaultChecked(permissionIds)
      }
    },
    // 默认选中
    defaultChecked(menuIdList) {
      this.$nextTick(() => {
        const arr = []
        menuIdList.forEach(item => {
          if (!this.$refs.menuListTree.getNode(item).childNodes || !this.$refs.menuListTree.getNode(item).childNodes.length) {
            arr.push(item)
          }
        })
        this.$refs.menuListTree.setCheckedKeys(arr)
      })
    },

    resetForm() {
      this.dataForm = {
        id: '',
        roleName: '',
        roleCode: '',
        description: ''
      }
      this.$nextTick(() => {
        if (this.$refs['dataForm']) {
          this.$refs['dataForm'].resetFields()
        }
        if (this.$refs.menuListTree) {
          this.$refs.menuListTree.setCheckedKeys([])
        }
      })
    },

    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              roleName: this.dataForm.roleName,
              roleCode: this.dataForm.roleCode,
              description: this.dataForm.description,
              permissionIds: [].concat(this.$refs.menuListTree.getCheckedKeys(), this.$refs.menuListTree.getHalfCheckedKeys())
            })
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
          })
        }
      })
    }
  }
}
</script>
