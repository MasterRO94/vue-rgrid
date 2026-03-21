import type { RowData } from './models/Row'
import type { Cell } from './models/Cell'

export function parseRowId(row: RowData | string | number): string | number {
  return row && typeof row === 'object' ? row.id : row
}

export function parseCellField(cell: Cell | string): string {
  return cell && typeof cell === 'object' ? cell.field : cell
}

export function upperFirstLetter(str = ''): string {
  if (!str) return ''
  return (str.charAt(0).toUpperCase() + str.substring(1)).replace(/_/g, ' ')
}
