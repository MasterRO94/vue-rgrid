export type SortDirection = 'asc' | 'desc' | null

export interface ColumnData {
  label?: string
  sortable?: boolean
  sortableVariants?: SortDirection[]
  filterable?: boolean
  html?: boolean
}

export class Column {
  field: string
  label: string
  sortable: boolean
  sortableVariants: SortDirection[]
  filterable: boolean
  html: boolean

  constructor(field: string, data: ColumnData = {}) {
    this.field = field
    this.label = data.label ?? ''
    this.sortable = data.sortable ?? false
    this.sortableVariants = data.sortableVariants ?? [null, 'asc', 'desc']
    this.filterable = data.filterable ?? false
    this.html = data.html ?? false
  }

  static make(field: string, data: ColumnData = {}): Column {
    return new Column(field, data)
  }
}
