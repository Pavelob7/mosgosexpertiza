<script setup lang="ts">
import {ref} from 'vue'
import {NButton, NSpace} from 'naive-ui'

// табличка и тип строки из неё
import Table from './components/Table.vue'
import type {TableRow} from './components/Table.vue'

// замоканные данные
import data1 from './data/data1.json'
import data2 from './data/data2.json'

// тут храним текущие данные, по дефолту — первые
const currentData = ref<TableRow[]>(data1)

// Настройки синей темы
const themeOverrides = {
  common: {
    primaryColor: '#5182e1',
    primaryColorHover: '#4098fc',
    primaryColorPressed: '#1060c9'
  },
  DataTable: {
    thColor: '#5182e1',          // Основной цвет шапки
    thTextColor: '#ffffff',      // Цвет текста
    thColorHover: '#6a96ec',     // Цвет при наведении (на 15% светлее)
    thColorPressed: '#3d6fd8',   // Цвет при нажатии (на 15% темнее)
    thFontWeight: '600'
  }
}


// функция для логов, просто печатаем строку, когда юзер что-то меняет
function handleUpdate(row: TableRow) {
  console.log('Обновили:', row)
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <!-- кнопки, чтоб переключать между наборами данных -->
    <n-space align="center" size="large" style="margin-bottom: 16px;">
      <n-button
          type="primary"
          :ghost="currentData === data1"
          @click="currentData = data1"
      >
        Данные 1
      </n-button>
      <n-button
          type="primary"
          :ghost="currentData === data2"
          @click="currentData = data2"
      >
        Данные 2
      </n-button>
    </n-space>

    <!-- Тут табличка, кидаем ей данные и ловим апдейты -->
    <Table :data="currentData" @update="handleUpdate"/>
  </n-config-provider>
</template>