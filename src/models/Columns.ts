import { Column } from './Column'
import type { ColumnData } from './Column'
import { upperFirstLetter } from '../utils'
import type { RowData } from './Row'

export class Columns {
  columns: Record<string, Column>

  constructor(columns: Record<string, ColumnData> = {}) {
    this.columns = {}
    for (const [field, data] of Object.entries(columns)) {
      this.columns[field] = Column.make(field, data ?? {})
    }
  }

  static make(columns: Record<string, ColumnData> = {}): Columns {
    return new Columns(columns)
  }

  static makeFromRow(row: RowData): Columns {
    const columns: Record<string, ColumnData> = {}
    for (const field of Object.keys(row.columns)) {
      columns[field] = { label: upperFirstLetter(field) }
    }
    return new Columns(columns)
  }

  isEmpty(): boolean {
    return Object.keys(this.columns).length === 0
  }

  add(field: string, data: ColumnData): void {
    this.columns[field] = Column.make(field, data)
  }

  remove(field: string): void {
    delete this.columns[field]
  }

  count(): number {
    return Object.keys(this.columns).length
  }
}
