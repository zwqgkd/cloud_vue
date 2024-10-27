// import './assets/main.css'
import { createApp } from 'vue'
import ElementPlus from "element-plus"
import {ElMessage, ElMessageBox} from "element-plus";
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from "element-plus/es/locale/lang/zh-cn";




import App from './App.vue'
import router from "./routes/index.js"

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(ElementPlus, {locale: zhCn})
app.use(ElMessage)
app.use(ElMessageBox)
app.mount('#app')
