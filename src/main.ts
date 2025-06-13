import { createApp } from 'vue'
import App from './App.vue'

// Импортируем конкретные компоненты
import {
    NDataTable,
    NSwitch,
    NDatePicker,
    NInputNumber,
    NConfigProvider
} from 'naive-ui'

const app = createApp(App)

app.component('NConfigProvider', NConfigProvider)
app.component('NDataTable', NDataTable)
app.component('NSwitch', NSwitch)
app.component('NDatePicker', NDatePicker)
app.component('NInputNumber', NInputNumber)

app.mount('#app')
