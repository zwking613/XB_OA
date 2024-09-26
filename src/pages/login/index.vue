<template>
  <div class="
    flex h-screen
     bg-[#f0f2f5] 
     items-center 
     justify-center 
     bg-[url('/src/assets/load_bg.jpg')] 
     bg-cover
     bg-center 
     bg-no-repeat">
    <el-card class="w-[450px] h-[280px]">
      <template #header>
        <h2>雄博科技管理系统</h2>
      </template>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" placeholder="用户名手机号">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" show-password placeholder="密码">
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @keyup.enter="handleLogin" @click="handleLogin" :loading="loading"
            class="w-[100%]">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
const stores = useAppStore()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  phone: '',
  password: ''
})

const rules = {
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  // phone: [
  //   { required: true, message: '请输入手机号', trigger: 'blur' },
  //   { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  // ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = () => {
  if (!loginFormRef.value) return

  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      try {
        stores.login(loginForm)
      } catch (error) {
        console.log(error)
      } finally{
        loading.value = false
      }
    }
  })
}
</script>

<style scoped></style>