<template>
  <div class="login">
    <div>
      <h1 class="title">Edu Boss 管理系统</h1>
      <el-form
        label-position="top"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="login-form"
      >
        <h2>登录</h2>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
            @click="onSubmit"
            class="login-btn"
            :loading="isLoginLoading"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { login } from '@/services/user'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      isLoginLoading: false,
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [{
          required: true, message: '请输入手机号', trigger: 'blur'
        }, {
          pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur'
        }],
        password: [{
          required: true, message: '请输入密码', trigger: 'blur'
        }, {
          min: 6, max: 18, message: '长度应在6-18位', trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    async onSubmit () {
      // 1. 表单验证
      // 2. 提交表单
      // 3. 处理请求结果
      //    成功: 跳转到首页
      //    失败: 给出提示
      try {
        await (this.$refs.form as Form).validate()
        this.isLoginLoading = true
        const { data } = await login(this.form)

        if (data.state !== 1) {
          this.$message.error(data.message)
        } else {
          this.$store.commit('setUser', data.content)

          // 登录成功，记录登录状态，状态需要能够全局访问，放到vuex中
          // this.$router.push({
          //   name: 'home'
          // })
          this.$router.push(this.$route.query.redirect as string || '/')
          this.$message.success('登录成功')
        }
      } catch (e) {
        console.log(e)
      }
      this.isLoginLoading = false
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .title{
    text-align: center;
  }
  .login-form {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
