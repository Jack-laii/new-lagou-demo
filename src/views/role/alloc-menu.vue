<template>
  <div class="alloc-menu">
    <el-card>
      <el-tree
        ref="menu-tree"
        node-key="id"
        :data="menus"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        :default-checked-keys="checkedKeys"
      ></el-tree>
      <div style="margin: 20px">
        <el-button
          @click="onReset"
        >清空</el-button>
        <el-button
          type="primary"
          @click="onSave"
        >保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'

export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  created () {
    this.loadMenus()
    this.loadRoleMenus()
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  methods: {
    onReset () {
      this.$refs['menu-tree'].setCheckedKeys([])
    },
    getCheckedKeys (menus) {
      menus.forEach(menu => {
        if (menu.subMenuList) {
          return this.getCheckedKeys(menu.subMenuList)
        }
        if (menu.selected) {
          this.checkedKeys = [...this.checkedKeys, menu.id]
        }
      })
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },
    async onSave () {
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$message.success('分配菜单成功')
        this.$router.push('/role')
      }
    },
    async loadMenus () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
