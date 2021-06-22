<template>
  <div class="app-header">
    <!-- 左侧面包屑 导航 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右侧 用户信息展示 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          :size="30"
          :src="userInfo.portrait || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'"
        ></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
        <el-dropdown-item
          divided
          @click.native="handleLogout"
        >退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
// 引入用户信息接口功能
import { getUserInfo } from '@/services/user'

export default {
  name: 'AppHeader',
  created () {
    this.loadUserInfo()
  },
  data () {
    return {
      userInfo: {}
    }
  },
  methods: {
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    // 退出功能
    handleLogout () {
      // 通过 Element 提供的 MessageBox 组件设置提示信息
      this.$confirm('确认退出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认执行的操作
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        // 1、 删除 store 中的用户信息
        this.$store.commit('setUser', null)
        // 2、 跳转到登录页
        this.$router.push('/login')
      }).catch(() => {
        // 取消执行的操作
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}

</script>

<style lang="scss" scoped>
.app-header {
  height: 100%;
  display: flex;
  align-items: center; // 纵轴居中
  justify-content: space-between;

  .el-dropdown-link {
    display: flex;
    align-items: center;  // 用户头像 右侧向下箭头居中显示
  }
}
</style>
