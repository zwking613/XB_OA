<template>
  <div class="login-container">
    <div class="login-content">
      <div class="left-section">
        <div class="company-info">
          <h1 class="company-name">核心理念</h1>
          <div v-for="(item, index) in companyValues" :key="index" class="info-item">
            <h2>{{ item.title }}</h2>
            <p>{{ item.content }}</p>
            <!-- <div v-if="item.child" class="child-values">
              <div v-for="(childItem, childIndex) in item.child" :key="childIndex" class="child-item">
                <h3>{{ childItem.title }}</h3>
                <p>{{ childItem.content }}</p>
              </div>
            </div> -->
          </div>
        </div>
      </div>
      <el-card class="login-card">
        <div class="logo-container">
          <img src="@/assets/logo.png" alt="雄博科技 Logo" class="logo" />
        </div>
        <div style="background-color: #fff;  padding: 20px; border-radius: 10px;">
          <h2 style="color: #555; font-size: 26px; font-weight: bold; text-align: center;padding-bottom: 10px;">
            雄博 OA 系统</h2>
        </div>
        <el-form :model="loginForm" :rules="rules" size='large' ref="loginFormRef" @keyup.enter="handleLogin">
          <el-form-item prop="phone">
            <el-input v-model="loginForm.phone" placeholder="用户名" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="密码" :prefix-icon="Lock" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" class="login-button" @click="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup >
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
const stores = useAppStore()
const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive({
  phone: '12345',
  password: '12345'
})

const rules = {
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  // phone: [
  //   { required: true, message: '请输入手机号', trigger: 'blur' },
  //   { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  // ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const companyValues= [
  { title: '企业使命', content: '以数智化赋能，助力中国光网基础设施效能跃升。' },
  { title: '企业愿景', content: '成为光网哑资源智能规划运维首席专家。' },
  { title: '经营理念', content: '追逐创新趋势，关注客户痛点；传递先进技术，维护行业生态。' },
  {
    title: '核心价值观', content: '专注、求实、创新、共赢。',
    child: [
      { title: '专注', content: '公司不断致力于技术创新与产品创新，利用自主知识产权研发了多项智能光缆运维软件系统，使哑资源运维管理变得可视化、智能化、精准化。并整合业内先进的光传输建设、维护仪表资源，形成了独特的全场景、多维度解决方案。' },
      { title: '求实', content: '公司及员工应该真实、诚实地处理事务，不隐真相或撒谎虚假。一个诚实的企业可以让顾客和社会产生信任感，从而增加市场份额和影响力。公司及员工要脚踏实地，不断追求实际的成果和效益，远离虚浮，实事求是。' },
      { title: '创新', content: '创新是企业发展的动力源泉，公司坚持与时俱进，注重技术创新、产品创新和机制创新，鼓励员工立足岗位，不断提高学习和创新能力，建设创新型企业，不断开创公司良好发展的新局面。' },
      { title: '共赢', content: '公司尊重员工，尊重人才，尊重劳动，提倡公司与员工之问、合作伙伴之间以及与社会各界的互利合作，共同实现可持续发展。' },
    ]
  },
  { title: '用人理念', content: '德才兼备；积极进取' },
  { title: '服务理念', content: '技术领先、服务卓越' }
]

const handleLogin =  () => {
  if (!loginFormRef.value) return
  try {
    loginFormRef.value.validate((valid) => {
      if (valid) {
        loading.value = true
        try {
          stores.login(loginForm)
        } catch (error) {
          console.log(error)
        } finally {
          loading.value = false
        }
      }
    })
  } catch (error) {
    console.error(error)
    ElMessage.error('登录失败，请检查您的用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
}

.login-content {
  display: flex;
  width: 100%;
  max-width: 1200px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.left-section {
  flex: 1;
  background: linear-gradient(135deg, #3498db, #8e44ad);
  padding: 40px;
  overflow-y: auto;
  max-height: 800px;
}

.company-info {
  color: #fff;
}

.company-name {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
}

.info-item {
  margin-bottom: 30px;
  animation: fadeIn 0.5s ease-in-out;
}

.info-item h2 {
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: bold;
}

.info-item p {
  font-size: 16px;
  line-height: 1.5;
}

.child-values {
  margin-top: 15px;
  padding-left: 20px;
}

.child-item {
  margin-bottom: 15px;
}

.child-item h3 {
  font-size: 18px;
  margin-bottom: 5px;
  font-weight: bold;
}

.child-item p {
  font-size: 14px;
  line-height: 1.4;
}

.login-card {
  width: 420px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo-container {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  max-width: 200px;
  height: auto;
}

.title {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
}

.login-button {
  width: 100%;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 750px) {
  .login-content {
    flex-direction: column;
  }

  .left-section {
    max-height: none;
    padding: 20px;
  }

  .login-card {
    width: 100%;
  }
}
</style>