<template>
  <div
    :class="cfg.styling.containerClass"
    data-rgrid
  >
    <slot name="grid-header" />

    <slot v-if="loading" name="init-loader">
      <div data-rgrid-loader class="py-8 text-center text-gray-400">Loading...</div>
    </slot>

    <div
      v-else
      :class="[cfg.styling.contentClass, { [cfg.styling.contentLoadingClass]: fetchingData }]"
      data-rgrid-content
    >
      <!-- Pagination info top -->
      <div
        v-if="cfg.pagination.infoEnabled && cfg.pagination.infoPosition === 'top'"
        :class="cfg.styling.pagination.infoClassTop"
        data-rgrid-pagination-info="top"
      >
        <slot name="pagination-info">{{ paginationInfo }}</slot>
      </div>

      <!-- Pagination top -->
      <RPagination
        v-if="!initializing && cfg.pagination.enabled && numberOfPages > 1
          && (cfg.pagination.position === 'top' || cfg.pagination.position === 'top-bottom')"
        v-model="pagination.currentPage"
        :config="cfg.pagination"
        :styling="cfg.styling.pagination"
        :number-of-pages="numberOfPages"
        @update:model-value="handlePagination"
      />

      <div :class="cfg.styling.tableWrapperClass" data-rgrid-table-wrapper>
        <!-- Loading overlay -->
        <slot v-if="fetchingData" name="grid-loader">
          <div data-rgrid-fetching class="py-4 text-center text-gray-400">Loading...</div>
        </slot>

        <!-- Table view -->
        <table
          v-if="!cardsView"
          v-bind="$attrs"
          :class="cfg.styling.tableClass"
          data-rgrid-table
        >
          <thead :class="cfg.styling.tableHeadClass" data-rgrid-thead>
            <tr :class="cfg.styling.tableRowClass" data-rgrid-header-row>
              <!-- Select-all header cell -->
              <th
                v-if="cfg.selection.enabled"
                v-show="gridData.rows.length"
                :class="cfg.styling.tableHeadCellClass"
                data-rgrid-header-cell-selection
              >
                <div :class="cfg.styling.selectionCheckboxWrapperClass" data-rgrid-checkbox>
                  <input
                    type="checkbox"
                    title="Select all"
                    :checked="isAllRowsOnPageSelected"
                    @input="toggleAllRowsSelection"
                  >
                  <span :class="cfg.styling.selectionCheckMarkClass" />
                </div>
              </th>

              <th
                v-for="(column, field) in gridData.columns.columns"
                :key="field"
                :class="[
                  cfg.styling.tableHeadCellClass,
                  { [cfg.styling.sortableColumnClass]: column.sortable },
                ]"
                data-rgrid-header-cell
              >
                <div :class="cfg.styling.tableHeadHolderClass" data-rgrid-header-holder>
                  <slot :column="column" :name="`column:${field}`">
                    <span>{{ column.label }}</span>
                  </slot>

                  <template v-if="cfg.sorting.enabled && column.sortable">
                    <span
                      v-show="sorting[field as string] === 'asc'"
                      :class="[cfg.styling.sortableIconClass, cfg.styling.sortableIconAscClass]"
                      data-rgrid-sort="asc"
                      @click="sort(field as string)"
                    >
                      <slot v-if="sorting[field as string] === 'asc'" :column="column" name="sorting-icon-asc">&#8593;</slot>
                    </span>

                    <span
                      v-show="sorting[field as string] === 'desc'"
                      :class="[cfg.styling.sortableIconClass, cfg.styling.sortableIconDescClass]"
                      data-rgrid-sort="desc"
                      @click="sort(field as string)"
                    >
                      <slot :column="column" name="sorting-icon-desc">&#8595;</slot>
                    </span>

                    <span
                      v-show="!sorting[field as string]"
                      :class="[cfg.styling.sortableIconClass, cfg.styling.sortableIconNoneClass]"
                      data-rgrid-sort="none"
                      @click="sort(field as string)"
                    >
                      <slot :column="column" name="sorting-icon-none">&#8597;</slot>
                    </span>
                  </template>

                  <slot
                    v-if="cfg.sorting.enabled && !column.sortable"
                    :column="column"
                    name="sorting-icon-disabled"
                  />
                </div>
              </th>
            </tr>
          </thead>

          <tbody :class="cfg.styling.tableBodyClass" data-rgrid-tbody>
            <template v-for="row in gridData.rows" :key="row.id">
              <tr
                :class="[
                  cfg.styling.tableRowClass,
                  {
                    [cfg.styling.tableRowExpandedClass]: hasExpandedDetails(row),
                    [cfg.styling.tableRowSelectedClass]: selectionHasRow(row),
                  },
                  additionalRowClass(row),
                ]"
                data-rgrid-row
                @click="onRowClick(row)"
                @dblclick="onRowDblClick(row)"
              >
                <td
                  v-if="cfg.selection.enabled"
                  :class="cfg.styling.tableBodyCellClass"
                  data-rgrid-cell-selection
                >
                  <div :class="cfg.styling.selectionCheckboxWrapperClass" data-rgrid-checkbox>
                    <input
                      type="checkbox"
                      :checked="selectionHasRow(row)"
                      :disabled="!row.selectable"
                      @input="toggleRowSelection(row)"
                    >
                    <span :class="cfg.styling.selectionCheckMarkClass" />
                  </div>
                </td>

                <td
                  v-for="(column, field) in gridData.columns.columns"
                  :key="field"
                  :class="[
                    cfg.styling.tableBodyCellClass,
                    {
                      [cfg.styling.tableBodyCellExpandedClass]: isFieldExpanded(row, field as string),
                    },
                  ]"
                  data-rgrid-cell
                  @click="onCellClick(row, field as string)"
                  @dblclick="onCellDblClick(row, field as string)"
                >
                  <slot
                    :cell="row.columns[field as string] ?? null"
                    :row="row"
                    :field="field as string"
                    :name="`cell:${field}`"
                  >
                    <template v-if="row.columns[field as string]">
                      <span v-if="!column.html">{{ row.columns[field as string].value }}</span>
                      <span v-else v-html="row.columns[field as string].value" />
                    </template>
                  </slot>
                </td>
              </tr>

              <!-- Row details -->
              <template v-for="(_col, field) in gridData.columns.columns" :key="`${row.id}-${field}`">
                <tr
                  v-if="$slots[`row-details:${field}`] && displayedDetails[row.id]"
                  v-show="isFieldExpanded(row, field as string)"
                  :class="cfg.styling.tableRowClass"
                  data-rgrid-row-details
                >
                  <td :colspan="totalColumnsCount" :class="cfg.styling.tableBodyCellClass" data-rgrid-cell>
                    <slot
                      :name="`row-details:${field}`"
                      :row="row"
                      :cell="row.columns[field as string] ?? null"
                      :field="field as string"
                    />
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>

        <!-- Card view -->
        <div v-else :class="cfg.styling.cardWrapperClass" data-rgrid-cards>
          <!-- Card select-all -->
          <div
            v-if="cfg.selection.enabled"
            :class="cfg.styling.cardControlsClass"
            data-rgrid-card-controls
          >
            <label :for="`select-all-rows-${uid}`">Select All</label>
            <div :class="cfg.styling.selectionCheckboxWrapperClass" data-rgrid-checkbox>
              <input
                :id="`select-all-rows-${uid}`"
                type="checkbox"
                title="Select all"
                :checked="isAllRowsOnPageSelected"
                @input="toggleAllRowsSelection"
              >
              <span :class="cfg.styling.selectionCheckMarkClass" />
            </div>
          </div>

          <template v-for="row in gridData.rows" :key="row.id">
            <div :class="cfg.styling.cardColumnClass">
              <div
                :class="[
                  cfg.styling.cardClass,
                  {
                    [cfg.styling.cardExpandedClass]: hasExpandedDetails(row),
                    [cfg.styling.cardSelectedClass]: selectionHasRow(row),
                  },
                  additionalRowClass(row),
                ]"
                data-rgrid-card
                @click="onRowClick(row)"
                @dblclick="onRowDblClick(row)"
              >
                <slot :row="row" name="card-header">
                  <div
                    v-if="cfg.selection.enabled"
                    :class="cfg.styling.cardControlsClass"
                    data-rgrid-card-controls
                  >
                    <div :class="cfg.styling.selectionCheckboxWrapperClass" data-rgrid-checkbox>
                      <input
                        type="checkbox"
                        :checked="selectionHasRow(row)"
                        :disabled="!row.selectable"
                        @input="toggleRowSelection(row)"
                      >
                      <span :class="cfg.styling.selectionCheckMarkClass" />
                    </div>
                  </div>
                </slot>

                <div
                  v-for="(column, field) in gridData.cardColumns.columns"
                  :key="field"
                  :class="cfg.styling.cardRowClass"
                  data-rgrid-card-row
                >
                  <div :class="cfg.styling.cardLabelClass" data-rgrid-card-label>
                    <slot :column="column" :name="`card-column:${field}`">
                      <slot :column="column" :name="`column:${field}`">
                        <span>{{ column.label }}</span>
                      </slot>
                    </slot>
                  </div>
                  <div
                    :class="[
                      cfg.styling.cardValueClass,
                      {
                        [cfg.styling.cardValueExpandedClass]: isFieldExpanded(row, field as string),
                      },
                    ]"
                    data-rgrid-card-value
                    @click="onCellClick(row, field as string)"
                    @dblclick="onCellDblClick(row, field as string)"
                  >
                    <slot
                      :cell="row.columns[field as string] ?? null"
                      :row="row"
                      :name="`cell:${field}`"
                      :field="field as string"
                    >
                      <template v-if="row.columns[field as string]">
                        <span v-if="!column.html">{{ row.columns[field as string].value }}</span>
                        <span v-else v-html="row.columns[field as string].value" />
                      </template>
                    </slot>
                  </div>
                </div>

                <slot name="card-footer" />
              </div>
            </div>

            <!-- Card row details -->
            <template v-for="(_col, field) in gridData.columns.columns" :key="`${row.id}-${field}`">
              <div
                v-if="$slots[`row-details:${field}`] && displayedDetails[row.id]"
                v-show="isFieldExpanded(row, field as string)"
                data-rgrid-card-details
              >
                <slot
                  :name="`row-details:${field}`"
                  :row="row"
                  :cell="row.columns[field as string] ?? null"
                  :field="field as string"
                />
              </div>
            </template>
          </template>
        </div>

        <!-- No data -->
        <div v-show="!fetchingData && !gridData.rows.length" :class="cfg.styling.noDataClass" data-rgrid-no-data>
          <slot name="no-data-text">
            <p>{{ cfg.noDataText }}</p>
          </slot>
        </div>
      </div>

      <!-- Pagination info bottom -->
      <div
        v-if="cfg.pagination.infoEnabled && cfg.pagination.infoPosition === 'bottom'"
        :class="cfg.styling.pagination.infoClassBottom"
        data-rgrid-pagination-info="bottom"
      >
        <slot name="pagination-info">{{ paginationInfo }}</slot>
      </div>

      <!-- Pagination bottom -->
      <RPagination
        v-if="!initializing && cfg.pagination.enabled && numberOfPages > 1
          && (cfg.pagination.position === 'bottom' || cfg.pagination.position === 'top-bottom')"
        v-model="pagination.currentPage"
        :config="cfg.pagination"
        :styling="cfg.styling.pagination"
        :number-of-pages="numberOfPages"
        @update:model-value="handlePagination"
      />
    </div>

    <slot name="grid-footer" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { defaultConfig, mergeConfig } from '../config'
import type { RGridConfig, RGridOptions } from '../config'
import { Row } from '../models/Row'
import type { RowData, RowConfig } from '../models/Row'
import { Columns } from '../models/Columns'
import type { ColumnData } from '../models/Column'
import type { SortDirection } from '../models/Column'
import { Api } from '../api'
import type { GridExpose } from '../api'
import { formatRequestQuery } from '../RequestQueryFormatter'
import RPagination from './RPagination.vue'

interface ColumnsOption {
  columns?: Record<string, ColumnData>
  cardColumns?: Record<string, ColumnData>
}

const props = withDefaults(defineProps<{
  rows?: Record<string, unknown>[]
  dataUrl?: string | null
  options?: RGridOptions & ColumnsOption
  requestParams?: Record<string, unknown>
}>(), {
  rows: () => [],
  dataUrl: null,
  options: () => ({}),
  requestParams: () => ({}),
})

const emit = defineEmits<{
  (e: 'rowSelected', payload: { row: RowData; data: GridDataType }): void
  (e: 'rowUnSelected', payload: { row: RowData; data: GridDataType }): void
  (e: 'rowSelectionToggled', payload: { row: RowData; data: GridDataType }): void
  (e: 'allRowsSelected', payload: { data: GridDataType }): void
  (e: 'selectedRowsCleared', payload: { data: GridDataType }): void
  (e: 'allRowsSelectionToggled', payload: { data: GridDataType }): void
  (e: 'rowClicked', row: RowData): void
  (e: 'rowDblClicked', payload: { row: RowData }): void
  (e: 'cellClicked', payload: { cell: unknown; row: RowData; field: string }): void
  (e: 'cellDblClicked', payload: { cell: unknown; row: RowData; field: string }): void
}>()

// Unique ID for label associations
let uidCounter = 0
const uid = `rgrid-${++uidCounter}-${Date.now()}`

// State
const cfg = ref<RGridConfig>({ ...defaultConfig })
const windowWidth = ref(0)
const loading = ref(false)
const initializing = ref(true)
const fetchingData = ref(false)
const fetchDataUrl = ref<string | null>(null)
const displayedDetails = ref<Record<string, string[]>>({})

interface GridDataType {
  columns: Columns
  cardColumns: Columns
  rows: RowData[]
  selectedRows: RowData[]
}

const gridData: GridDataType = reactive({
  columns: Columns.make(),
  cardColumns: Columns.make(),
  rows: [] as RowData[],
  selectedRows: [] as RowData[],
})

const pagination = reactive({
  currentPage: 1,
  total: 0,
  perPage: undefined as number | undefined,
})

const sorting = ref<Record<string, SortDirection>>({})
const additionalRequestParams = ref<Record<string, unknown>>({})

// Computed
const numberOfPages = computed(() =>
  Math.ceil(pagination.total / (cfg.value.pagination.perPage || 1))
)

const isAllRowsOnPageSelected = computed(() => {
  if (!gridData.selectedRows.length) return false
  const selectableRows = gridData.rows.filter(r => r.selectable)
  return selectableRows.length > 0 && selectableRows.every(
    row => gridData.selectedRows.some(r => r.id === row.id)
  )
})

const paginationInfo = computed(() => {
  const from = (pagination.currentPage - 1) * itemsPerPage.value + 1
  const to = from + gridData.rows.length - 1
  return cfg.value.pagination.infoTemplate
    .replace(/:total/g, String(pagination.total))
    .replace(/:from/g, String(from))
    .replace(/:to/g, String(to))
})

const totalColumnsCount = computed(() => {
  if (!gridData.columns) return 0
  const count = gridData.columns.count()
  return cfg.value.selection.enabled ? count + 1 : count
})

const cardsView = computed(() =>
  cfg.value.responsive.enabled && windowWidth.value <= cfg.value.responsive.breakpoint
)

const itemsPerPage = computed(() =>
  pagination.perPage ?? cfg.value.pagination.perPage
)

// Helper for template
function hasExpandedDetails(row: RowData): boolean {
  const d = displayedDetails.value[row.id]
  return !!d?.length
}

function isFieldExpanded(row: RowData, field: string): boolean {
  return !!displayedDetails.value[row.id]?.includes(field)
}

function onRowClick(row: RowData) {
  emit('rowClicked', row)
}

function onRowDblClick(row: RowData) {
  emit('rowDblClicked', { row })
}

function onCellClick(row: RowData, field: string) {
  emit('cellClicked', { cell: row.columns[field] ?? null, row, field })
}

function onCellDblClick(row: RowData, field: string) {
  emit('cellDblClicked', { cell: row.columns[field] ?? null, row, field })
}

// Methods
function prepareConfiguration() {
  cfg.value = mergeConfig(defaultConfig, props.options)

  const defaultSorting = cfg.value.sorting.defaultSortingColumns
  if (defaultSorting && Object.keys(defaultSorting).length) {
    for (const [field, value] of Object.entries(defaultSorting)) {
      sorting.value[field] = value
    }
  }

  if (props.dataUrl) {
    fetchDataUrl.value = props.dataUrl
  }

  pagination.currentPage = props.options?.pagination?.page ?? 1
  additionalRequestParams.value = props.requestParams ?? {}
}

function prepareColumns() {
  const columns = props.options?.columns ?? {}
  const cardCols = props.options?.cardColumns ?? columns

  gridData.columns = Columns.make(columns)
  gridData.cardColumns = Columns.make(cardCols)
}

function prepareHeadersFromRow(row: RowData) {
  gridData.columns = Columns.makeFromRow(row)
  if (gridData.cardColumns.isEmpty()) {
    gridData.cardColumns = gridData.columns
  }
}

async function prepareRows() {
  if (fetchDataUrl.value) {
    await fetchData()
  } else {
    gridData.rows = props.rows
      .map(cfg.value.prepareRowHandler)
      .map(row => Row.make(row))
  }
}

async function fetchData() {
  fetchingData.value = true
  try {
    const params = prepareRequestParams()
    const client = axios.create(cfg.value.axios)
    const response = await client.get(fetchDataUrl.value!, { params })
    const rowConfig: RowConfig = {
      idField: cfg.value.idField,
      canSelectRowHandler: cfg.value.selection.canSelectRowHandler,
    }
    gridData.rows = Object.values(response.data.data as Record<string, unknown>[])
      .map(cfg.value.prepareRowHandler)
      .map(row => Row.make(row, rowConfig))
    if (cfg.value.pagination.enabled && response.data.pagination) {
      Object.assign(pagination, response.data.pagination)
    }
  } catch (e) {
    console.error('[vue-rgrid] Fetch error:', e)
  }
  fetchingData.value = false
}

function prepareRequestParams(): Record<string, unknown> {
  return formatRequestQuery({
    page: pagination.currentPage || 1,
    perPage: itemsPerPage.value,
    sorting: sorting.value,
    ...additionalRequestParams.value,
  })
}

function handlePagination(page: number) {
  pagination.currentPage = page
  fetchData()
}

async function init(loadRows = true) {
  initializing.value = true
  prepareConfiguration()
  prepareColumns()

  if (loadRows) {
    await prepareRows()
  }

  if (gridData.columns.isEmpty() && gridData.rows.length) {
    prepareHeadersFromRow(gridData.rows[0])
  }

  if (cfg.value.selection.resetSelectionOnReload) {
    gridData.selectedRows = []
  }

  initializing.value = false
}

function selectionHasRow(row: RowData): boolean {
  return gridData.selectedRows.some(r => r.id === row.id)
}

function toggleRowSelection(row: RowData) {
  if (!selectionHasRow(row)) {
    gridData.selectedRows.push(row)
    emit('rowSelected', { row, data: gridData })
  } else {
    gridData.selectedRows = gridData.selectedRows.filter(r => r.id !== row.id)
    emit('rowUnSelected', { row, data: gridData })
  }
  emit('rowSelectionToggled', { row, data: gridData })
}

function toggleAllRowsSelection() {
  if (!isAllRowsOnPageSelected.value) {
    for (const row of gridData.rows.filter(r => r.selectable)) {
      if (!selectionHasRow(row)) {
        gridData.selectedRows.push(row)
      }
    }
    emit('allRowsSelected', { data: gridData })
  } else {
    gridData.selectedRows = []
    emit('selectedRowsCleared', { data: gridData })
  }
  emit('allRowsSelectionToggled', { data: gridData })
}

function sort(field: string) {
  if (cfg.value.sorting.multipleColumnsSorting) {
    sortMultipleColumns(field)
  } else {
    sortSingleColumn(field)
  }
  fetchData()
}

function sortMultipleColumns(field: string) {
  if (!sorting.value[field]) {
    sorting.value[field] = 'asc'
  } else {
    sorting.value[field] = sorting.value[field] === 'asc' ? 'desc' : null
  }
}

function sortSingleColumn(field: string) {
  if (!sorting.value[field]) {
    sorting.value = { [field]: 'asc' }
  } else {
    sorting.value = { [field]: sorting.value[field] === 'asc' ? 'desc' : null }
  }
}

function additionalRowClass(row: RowData): string {
  if (typeof cfg.value.additionalRowClassHandler === 'function') {
    return cfg.value.additionalRowClassHandler(row as any)
  }
  return ''
}

function redraw() {
  gridData.columns = Columns.make(
    Object.fromEntries(
      Object.entries(gridData.columns.columns).map(([field, col]) => [
        field,
        { label: col.label, sortable: col.sortable, filterable: col.filterable, html: col.html },
      ])
    )
  )
}

function handleResize() {
  windowWidth.value = window.innerWidth
}

function isNeedsToReloadAccordingToNewProps(): boolean {
  if (props.dataUrl && props.dataUrl !== fetchDataUrl.value) return true
  if (props.rows?.length) return true

  if (props.options?.pagination) {
    if (
      props.options.pagination.perPage &&
      props.options.pagination.perPage !== cfg.value.pagination.perPage
    ) return true
    if (
      props.options.pagination.page &&
      props.options.pagination.page !== pagination.currentPage
    ) return true
  }

  return false
}

function api(): Api {
  const expose: GridExpose = {
    data: gridData,
    pagination,
    displayedDetails,
    handlePagination,
    init,
    redraw,
  }
  return Api.make(expose)
}

// Watch props for changes
watch(
  () => [props.rows, props.dataUrl, props.options, props.requestParams],
  () => {
    additionalRequestParams.value = props.requestParams ?? {}
    if (isNeedsToReloadAccordingToNewProps()) {
      init(true)
    } else {
      init(false)
    }
  },
  { deep: true }
)

// Lifecycle
loading.value = true
init().then(() => {
  loading.value = false
})

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Expose for parent access
defineExpose({ api, init, redraw, gridData, pagination, sorting, displayedDetails })
</script>
