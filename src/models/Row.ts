import hash from 'object-hash'
import { Cell } from './Cell'

export interface RowConfig {
  idField?: string
  canSelectRowHandler?: (row: RowData) => boolean
}

export interface RowData {
  config: RowConfig
  rawColumns: Record<string, unknown>
  columns: Record<string, Cell>
  id: string | number
  selectable: boolean
}

export class Row {
  static make(columns: Record<string, unknown> = {}, config: RowConfig = {}): RowData {
    const cells = Row.prepareColumns(columns)
    const id = Row.resolveId(cells, config)
    const row: RowData = {
      config,
      rawColumns: columns,
      columns: cells,
      id,
      selectable: false,
    }
    row.selectable = typeof config.canSelectRowHandler === 'function'
      ? config.canSelectRowHandler(row)
      : false
    return row
  }

  static resolveId(columns: Record<string, Cell>, config: RowConfig): string | number {
    if (config.idField && columns[config.idField]) {
      return columns[config.idField].value as string | number
    }
    return hash(columns)
  }

  static prepareColumns(columns: Record<string, unknown> = {}): Record<string, Cell> {
    const cells: Record<string, Cell> = {}
    for (const [field, value] of Object.entries(columns)) {
      cells[field] = Cell.make(field, value)
    }
    return cells
  }
}
