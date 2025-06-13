<script setup lang="ts">
import { h, ref, watch } from 'vue'
import {NSwitch, NDatePicker, NInputNumber} from 'naive-ui'
import type {DataTableColumns, DataTableSortState} from 'naive-ui'

// Тип строки таблицы
export interface TableRow {
  id: number
  steName: string
  isActual: boolean
  priceEndDate: number | null
  priceNotNds: number
  nds: number
  price: number
  fillEndDate: string
}

// пропсы, будет массив строк
const props = defineProps<{
  data: TableRow[]
}>()

// контроль изменений
const emit = defineEmits<{
  (e: 'update', row: TableRow): void
}>()

// Состояние сортировки
const sortState = ref<DataTableSortState | null>(null)

// Отсортированные данные
const sortedData = ref<TableRow[]>(props.data)

// Функция сортировки данных
const updateSortedData = () => {
  if (!sortState.value) {
    sortedData.value = [...props.data]
    return
  }

  const { columnKey, order } = sortState.value
  let result = 0

  sortedData.value = [...props.data].sort((a, b) => {
    if (columnKey && columnKey in a && columnKey in b) {
      const key = columnKey as keyof TableRow
      const valA = a[key]
      const valB = b[key]

      if (typeof valA === 'number' && typeof valB === 'number') {
        result = valA - valB
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        result = valA.localeCompare(valB, undefined, {
          numeric: true,    // чтобы "СТЕ 10" > "СТЕ 2"
          sensitivity: 'base' // нечувствительно к регистру и диакритике
        })
      }
    }

    return order === 'descend' ? -result : result
  })
}


// Следим за входными данными и пересортировываем
watch(
    () => props.data,
    () => {
      updateSortedData()
    },
    { immediate: true }
)


// Обработчик сортировки
const handleSorterChange = (sorter: DataTableSortState) => {
  sortState.value = sorter
  updateSortedData()
}

// функция для апдейта строки, пересчитывает цену с НДС и шлёт наружу
function updateRow<K extends keyof TableRow>(row: TableRow, key: K, value: TableRow[K]) {
  try {
    row[key] = value;

    if (key === 'priceNotNds' || key === 'nds') {
      const notNds = Number(row.priceNotNds) || 0;
      const ndsVal = Number(row.nds) || 0;
      row.price = notNds + (notNds * ndsVal / 100);
    }

    emit('update', row);
  } catch (error) {
    console.error('Update error:', error);
  }
}

// колонки для таблицы, некоторые с редактированием
const columns: DataTableColumns<TableRow> = [
  {
    title: 'Наименование СТЕ',
    key: 'steName',
    sorter: true
  },
  {
    title: 'Актуально',
    key: 'isActual',
    render: (row) =>
        h(NSwitch, {
          value: row.isActual,
          'onUpdate:value': (val: boolean) => updateRow(row, 'isActual', val)
        })
  },
  {
    title: 'Срок действия предоставленных сведений',
    key: 'priceEndDate',
    render: (row) => h(NDatePicker, {
      value: row.priceEndDate,
      type: 'date',
      'onUpdate:value': (val: number | null) => updateRow(row, 'priceEndDate', val),
      format: 'dd.MM.yyyy'
    })
  },
  {
    title: 'Цена, руб. без НДС',
    key: 'priceNotNds',
    render: (row) =>
        h(NInputNumber, {
          value: row.priceNotNds,
          min: 0,
          'onUpdate:value': (val: number | null) =>
              updateRow(row, 'priceNotNds', val ?? 0)
        })
  },
  {
    title: 'НДС, %',
    key: 'nds',
    render: (row) =>
        h(NInputNumber, {
          value: row.nds,
          min: 0,
          max: 100,
          'onUpdate:value': (val: number | null) => updateRow(row, 'nds', val ?? 0)
        })
  },
  {
    title: 'Цена, руб. с НДС',
    key: 'price',
    render: (row) => new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(row.price)
  },
  {
    title: 'Срок заполнения',
    key: 'fillEndDate'
  }
]
</script>

<template>
  <!-- кидаем колонки, данные и отключаем пагинацию -->
  <n-data-table
      :columns="columns"
      :data="sortedData"
      :row-key="(row: TableRow) => row.id"
      :pagination="false"
      @update:sorter="handleSorterChange"
  />
</template>
