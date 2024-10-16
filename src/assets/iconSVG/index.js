// 自动引入iconSVG 文件下的所有svg文件，文件名作为组件名，文件名首字母以AL开头，避免与element plus的图标冲突

import { defineAsyncComponent } from 'vue'

const modules = import.meta.glob('./*.vue')

const ALIcon = {}

for (const path in modules) {
  const componentName = path.match(/\.\/(.*)\.vue$/)[1]
  ALIcon[componentName] = defineAsyncComponent(modules[path])
}
export default ALIcon
