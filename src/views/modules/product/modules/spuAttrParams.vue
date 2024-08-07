<template>
  <el-card class="box-card" style="width: 80%; margin: 20px auto">
    <el-tabs tab-position="left" style="width: 98%">
      <el-tab-pane :label="item.groupName" v-for="(item, index) in attrGroups" :key="index">
        <el-form ref="form" :model="spuModel">
          <el-form-item :label="attr.attrName" v-for="(attr, idx) in item.attrList" :key="idx">
            <el-select
              v-model="baseAttrs[index][idx].attrValues"
              :multiple="attr.valueType === 1"
              filterable
              allow-create
              default-first-option
              placeholder="请选择或输入值"
            >
              <el-option v-for="(val, vidx) in attr.valueSelect.split(';')" :key="vidx" :label="val" :value="val"> </el-option>
            </el-select>
            <el-checkbox v-model="baseAttrs[index][idx].isShow" :true-label="1" :false-label="0"> 快速展示 </el-checkbox>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div style="margin: auto">
      <el-button type="primary" @click="preStep">上一步</el-button>
      <el-button type="success" @click="nextStep">下一步：设置销售属性</el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    spuModel: Object,
    default: {}
  },
  data () {
    return {
      attrGroups: [],
      baseAttrs: [],
      url: {
        listAttrGroupWithAttrs: '/product/attrGroup/listAttrGroupWithAttrs'
      }
    }
  },
  mounted () {
    this.queryList()
  },
  methods: {
    queryList () {
      // 查询分组信息
      this.$http({
        url: this.$http.adornUrl(this.url.listAttrGroupWithAttrs),
        method: 'get',
        params: this.$http.adornParams({ categoryId: this.spuModel.categoryId })
      }).then(({ data }) => {
        if (data.code === 200) {
          const list = data.data
          // 赋值
          this.attrGroups = list
          this.baseAttrs = list.map(group => group.attrList.map(attr => ({
            id: attr.id,
            attrValues: '',
            isShow: attr.isShow
          })))
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    filterAndFormatAttributes (attributes) {
      return attributes.filter(attr => attr.attrValues !== '')
        .map(attr => {
          let { id, attrValues, isShow } = attr
          if (Array.isArray(attrValues)) {
            attrValues = attrValues.join(';')
          }
          return { id, attrValues, isShow }
        })
    },
    preStep () {
      this.$emit('previous-step')
    },
    nextStep () {
      const formattedAttrs = this.baseAttrs
        .map(group => this.filterAndFormatAttributes(group))
        .flat()
      this.spuModel.baseAttrs = formattedAttrs
      this.$emit('next-step')
    }
  }
}
</script>

<style scoped>
</style>