<template>
  <div class="login">
    <!-- Form 组件 -->
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top"
    >
      <el-form-item
        label="手机号"
        prop="phone"
      >
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model="form.password"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="isLoginLoading"
          @click="onSubmit"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import request from '@/utils/request'
// import qs from 'qs'
import { login } from '@/services/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      // 用于 存储表单数据的对象
      form: {
        phone: '18201288771',
        password: '111111'
      },
      // 用于 设置表单校验规则
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 8, message: '密码格式有误，请输入6-8位数字', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    // ES6 设置代码为异步语法：async、await
    async onSubmit () {
      try {
        // 1、 设置校验：   登录表单数据校验成功后的功能
        await this.$refs.form.validate()
        console.log('校验成功~')

        // 2、 发送请求
        this.isLoginLoading = true
        const { data } = await login(this.form)
        this.isLoginLoading = false
        // console.log(data)

        // 3、 响应处理
        if (data.state === 1) {
          this.$message.success('登录成功')
          // 将用户信息存储到 Vuex 中，用于 其他组件间的数据共享
          this.$store.commit('setUser', data.content)
          // 根据可能存储的 redirect 数据进行跳转
          this.$router.push(this.$route.query.redirect || '/')
          // this.$router.push({ name: 'home' })
        } else {
          this.$message.error('登录失败')
        }
      } catch (error) {
        // 登录表单数据校验失败提示信息
        console.log('校验失败！', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-form {
      background-color: #fff;
      width: 300px;
      padding: 20px;
      border-radius: 10px;

      .el-button {
        width: 100%;
      }
    }
  }
</style>
