<template>
  <div class="w-full">
    <el-header class="bg-[#00C0EF] color-[#ffff] flex items-center justify-between w-full">
      <div class="flex items-center">
        <div class="flex items-center h-full text-xl font-bold">
          <img src="/src/assets/logo.png" alt="logo" class="h-8 mr-2 w-30" />
        </div>
      </div>  
      <el-dropdown>
        <span class="flex items-center cursor-pointer el-dropdown-link">
          <el-avatar :size="32" :src="userAvatar"></el-avatar>
          <span class="ml-2">{{ userStore.userInfo.userName }}</span>
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="w-[150px]">
            <el-dropdown-item divided @click="handleChangePassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided @click="handleResetPassword">重置密码</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
    <!-- 重置密码确认弹窗 -->
    <el-dialog v-model="resetDialogVisible" title="重置密码" width="30%" :close-on-click-modal="false"
      :destroy-on-close="true">
      <p>确定要重置密码吗？重置后密码将变为初始密码。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmResetPassword">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改密码弹窗 -->
    <el-dialog v-model="dialogVisible" title="修改密码" width="30%">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="旧密码" prop="oldpwd">
          <el-input v-model="form.oldpwd" type="password" show-password placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newpwd">
          <el-input v-model="form.newpwd" type="password" show-password placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input v-model="form.confirmPwd" type="password" show-password placeholder="请输入确认密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Header">
import { ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
const userStore = useAppStore()
const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
const dialogVisible = ref(false)
const form = ref({
  oldpwd: '',
  newpwd: '',
  confirmPwd: ''
})

const rules = {
  oldpwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newpwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 12, max: 20, message: '密码长度必须在12-20位之间', trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/, message: '密码必须包含英文大写、小写、数字和特殊字符', trigger: 'blur' }
  ],
  confirmPwd: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { min: 12, max: 20, message: '密码长度必须在12-20位之间', trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/, message: '密码必须包含英文大写、小写、数字和特殊字符', trigger: 'blur' }
  ]
}
const formRef = ref(null)
const resetDialogVisible = ref(false)

const handleChangePassword = () => {
  dialogVisible.value = true
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate((valid) => {
    if (valid) {
      if (form.value.newpwd !== form.value.confirmPwd) return ElMessage.error('新密码与确认密码不一致,请重新输入!');
      if (form.value.oldpwd === form.value.newpwd) return ElMessage.error('新密码不能与旧密码相同，请重新输入！');
      userStore.updatePassword(form.value, () => {
        dialogVisible.value = false
      })
    }
  })
}


const handleResetPassword = () => {
  resetDialogVisible.value = true
}

const confirmResetPassword = () => {
  userStore.resetPassword(() => {
    resetDialogVisible.value = false
  })
}

const handleLogout = () => {
  try {
    userStore.logout()
  } catch (error) {
    console.error(error)
  }
}

</script>
