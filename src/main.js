import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
import { createPinia } from "pinia";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ALIcon from '@/assets/iconSVG/index.js'
import ElementPlus from 'element-plus';
import 'dayjs/locale/zh-cn';
import locale from 'element-plus/es/locale/lang/zh-cn';
import TableModule from '@/components/table/TableModule.vue'
import DialogModule from '@/components/dialog/DialogModule.vue';
import FormModule from '@/components/form/FormModule.vue';
import SelectLimit from '@/components/form/SelectLimit.vue';
import SelectTree from '@/components/form/SelectTree.vue';
import './style.css'
import 'element-plus/dist/index.css';

const app = createApp(App)
// 全局注册Table组件
app.component('TableModule', TableModule)
// 全局注册dialog组件
app.component('DialogModule', DialogModule)
// 全局注册form组件
app.component('FormModule', FormModule)
// 全局注册SelectLimit组件
app.component('SelectLimit', SelectLimit)
app.component('SelectTree', SelectTree)

// 全局注册element-plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 全局注册svg图标
for (const [key, component] of Object.entries(ALIcon)) {
    app.component(key, component)
}

app.use(ElementPlus, { locale });

app.use(createPinia());
app.use(router)//使用路由
app.mount('#app')//挂载
