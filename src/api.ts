import { parseRowId, parseCellField } from './utils'
import type { RowData } from './models/Row'
import type { Cell } from './models/Cell'
import type { Columns } from './models/Columns'
import type { ColumnData } from './models/Column'
import type { Ref } from 'vue'

export interface GridState {
  rows: RowData[]
  selectedRows: RowData[]
  columns: Columns
  cardColumns: Columns
}

export interface GridExpose {
  data: GridState
  pagination: { currentPage: number; total: number; perPage?: number }
  displayedDetails: Ref<Record<string, string[]>>
  handlePagination: (page: number) => void
  init: (loadRows?: boolean) => Promise<void>
  redraw: () => void
}

export class Api {
  private grid: GridExpose

  constructor(grid: GridExpose) {
    this.grid = grid
  }

  static make(grid: GridExpose): Api {
    return new Api(grid)
  }

  getRows(): RowData[] {
    return this.grid.data.rows
  }

  getSelectedRows(): RowData[] {
    return this.grid.data.selectedRows
  }

  getColumns(): Columns {
    return this.grid.data.columns
  }

  getCardColumns(): Columns {
    return this.grid.data.cardColumns
  }

  addColumn(field: string, column: ColumnData, redraw = true): void {
    this.grid.data.columns.add(field, column)
    if (redraw) this.redraw()
  }

  removeColumn(field: string, redraw = true): void {
    this.grid.data.columns.remove(field)
    if (redraw) this.redraw()
  }

  page(page = 1): void {
    this.grid.pagination.currentPage = page
    this.grid.handlePagination(page)
  }

  nextPage(): void {
    this.grid.handlePagination(this.grid.pagination.currentPage + 1)
  }

  prevPage(): void {
    this.grid.handlePagination(this.grid.pagination.currentPage - 1)
  }

  perPage(perPage: number): void {
    this.grid.pagination.currentPage = 1
    this.grid.pagination.perPage = perPage
    this.grid.handlePagination(this.grid.pagination.currentPage)
  }

  redraw(): void {
    this.grid.redraw()
  }

  reload(): void {
    this.grid.init(true)
  }

  displayDetails(cellOrField: Cell | string, row: RowData | string | number): void {
    const rowId = String(parseRowId(row))
    const field = parseCellField(cellOrField)
    const details = this.grid.displayedDetails.value

    if (!this.isDetailsExpanded(field, row)) {
      if (!details[rowId]) {
        details[rowId] = []
      }
      details[rowId].push(field)
    }
  }

  hideDetails(cellOrField: Cell | string, row: RowData | string | number): void {
    const rowId = String(parseRowId(row))
    const field = parseCellField(cellOrField)
    const details = this.grid.displayedDetails.value

    if (this.isDetailsExpanded(field, row)) {
      details[rowId] = details[rowId].filter(f => f !== field)
    }
  }

  toggleDetails(cellOrField: Cell | string, row: RowData | string | number): void {
    const rowId = String(parseRowId(row))
    const field = parseCellField(cellOrField)

    if (!this.isDetailsExpanded(field, row)) {
      this.displayDetails(field, rowId)
    } else {
      this.hideDetails(field, rowId)
    }
  }

  isDetailsExpanded(cellOrField: Cell | string, row: RowData | string | number): boolean {
    const rowId = String(parseRowId(row))
    const field = parseCellField(cellOrField)
    const details = this.grid.displayedDetails.value

    return !!details[rowId]?.includes(field)
  }
}
