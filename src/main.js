import { createApp } from 'vue'
import './style.css'
import App from '@/App.vue'
import router from '@/router/index'
import { createPinia } from "pinia";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


app.use(createPinia());
app.use(router)//使用路由
app.mount('#app')//挂载
