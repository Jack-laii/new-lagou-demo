<template>
<!-- 容器 -->
  <el-container>
    <!-- 左边容器 -->
    <el-aside width="200px">
      <!-- 3、侧边栏组件 视图 -->
      <app-aside></app-aside>
    </el-aside>
    <!-- 右边容器 -->
    <el-container>
      <!-- 头部组件 -->
      <el-header>
        <app-header></app-header>
      </el-header>
      <!-- 主体组件 -->
      <el-main>
        <!-- 子路由出口：侧边栏导航对应内容 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 1、引入 侧边栏组件
import AppAside from './components/AppAside.vue'
import AppHeader from './components/AppHeader.vue'

export default {
  name: 'Layout',
  // 2、将侧边栏 注册为 layout 的子组件
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="scss" scoped>
  .el-container {
    height: 100vh;
    min-width: 980px;
  }

  .el-aside {
    background-color: #d3dce6;
  }
  .el-header {
    background-color: #f5f8ff;
  }
  .el-main {
    background-color: #e9eef3;
  }
</style>
