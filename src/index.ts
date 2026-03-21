import type { App, Plugin } from 'vue'
import RGrid from './components/RGrid.vue'

export { RGrid }
export { Api } from './api'
export type { GridExpose, GridState } from './api'
export { Cell } from './models/Cell'
export type { CellConfig } from './models/Cell'
export { Column } from './models/Column'
export type { ColumnData, SortDirection } from './models/Column'
export { Columns } from './models/Columns'
export { Row } from './models/Row'
export type { RowConfig, RowData } from './models/Row'
export { defaultConfig, mergeConfig } from './config'
export type {
  RGridConfig,
  RGridOptions,
  PaginationConfig,
  SortingConfig,
  SelectionConfig,
  ResponsiveConfig,
  StylingConfig,
  PaginationStyling,
  DeepPartial,
} from './config'
export { formatRequestQuery } from './RequestQueryFormatter'
export { parseRowId, parseCellField, upperFirstLetter } from './utils'

export const VueRGridPlugin: Plugin = {
  install(app: App) {
    app.component('RGrid', RGrid)
  },
}

export default RGrid
