import type { Row } from './models/Row'
import type { SortDirection } from './models/Column'
import type { AxiosRequestConfig } from 'axios'

export interface PaginationConfig {
  enabled: boolean
  position: 'top' | 'bottom' | 'top-bottom'
  perPage: number
  pageRange: number
  prevText: string
  nextText: string
  breakViewText: string
  firstLastButton: boolean
  firstButtonText: string
  lastButtonText: string
  hidePrevNext: boolean
  infoEnabled: boolean
  infoPosition: 'top' | 'bottom'
  infoTemplate: string
  page?: number
}

export interface SortingConfig {
  enabled: boolean
  multipleColumnsSorting: boolean
  defaultSortingColumns: Record<string, SortDirection>
}

export interface SelectionConfig {
  enabled: boolean
  resetSelectionOnReload: boolean
  canSelectRowHandler: (row: Row) => boolean
}

export interface ResponsiveConfig {
  enabled: boolean
  breakpoint: number
}

export interface PaginationStyling {
  infoClassTop: string
  infoClassBottom: string
  containerClass: string
  pageClass: string
  pageLinkClass: string
  activePageClass: string
  prevClass: string
  prevLinkClass: string
  nextClass: string
  nextLinkClass: string
  disabledClass: string
  breakViewClass: string
  breakViewLinkClass: string
}

export interface StylingConfig {
  containerClass: string
  contentClass: string
  contentLoadingClass: string
  tableWrapperClass: string
  tableClass: string
  tableHeadClass: string
  tableRowClass: string
  tableRowExpandedClass: string
  tableRowSelectedClass: string
  tableHeadCellClass: string
  tableHeadHolderClass: string
  tableBodyClass: string
  tableBodyCellClass: string
  tableBodyCellExpandedClass: string
  cardWrapperClass: string
  cardControlsClass: string
  cardColumnClass: string
  cardClass: string
  cardExpandedClass: string
  cardSelectedClass: string
  cardRowClass: string
  cardLabelClass: string
  cardValueClass: string
  cardValueExpandedClass: string
  selectionCheckboxWrapperClass: string
  selectionCheckMarkClass: string
  sortableIconClass: string
  sortableIconAscClass: string
  sortableIconDescClass: string
  sortableIconNoneClass: string
  sortableColumnClass: string
  noDataClass: string
  pagination: PaginationStyling
}

export interface RGridConfig {
  pagination: PaginationConfig
  noDataText: string
  sorting: SortingConfig
  filtering: boolean
  selection: SelectionConfig
  idField: string
  axios: AxiosRequestConfig
  responsive: ResponsiveConfig
  additionalRowClassHandler: (row: Row) => string
  prepareRowHandler: (row: Record<string, unknown>) => Record<string, unknown>
  styling: StylingConfig
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RGridOptions = DeepPartial<RGridConfig>

export const defaultConfig: RGridConfig = {
  pagination: {
    enabled: true,
    position: 'bottom',
    perPage: 10,
    pageRange: 3,
    prevText: 'Previous',
    nextText: 'Next',
    breakViewText: '...',
    firstLastButton: true,
    firstButtonText: '«',
    lastButtonText: '»',
    hidePrevNext: false,
    infoEnabled: true,
    infoPosition: 'top',
    infoTemplate: 'Displaying :from..:to of :total entries',
  },
  noDataText: 'No data to display',
  sorting: {
    enabled: true,
    multipleColumnsSorting: true,
    defaultSortingColumns: {},
  },
  filtering: true,
  selection: {
    enabled: true,
    resetSelectionOnReload: false,
    canSelectRowHandler: () => true,
  },
  idField: 'id',
  axios: {},
  responsive: {
    enabled: true,
    breakpoint: 1023,
  },
  additionalRowClassHandler: () => '',
  prepareRowHandler: (row) => row,
  styling: {
    containerClass: 'w-full',
    contentClass: 'relative',
    contentLoadingClass: 'opacity-50 pointer-events-none',
    tableWrapperClass: 'overflow-x-auto',
    tableClass: 'min-w-full divide-y divide-gray-200',
    tableHeadClass: 'bg-gray-50',
    tableRowClass: 'border-b border-gray-200 transition-colors hover:bg-gray-50',
    tableRowExpandedClass: 'bg-blue-50',
    tableRowSelectedClass: 'bg-blue-100',
    tableHeadCellClass: 'px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider',
    tableHeadHolderClass: 'flex items-center gap-1',
    tableBodyClass: 'bg-white divide-y divide-gray-200',
    tableBodyCellClass: 'px-4 py-3 text-sm text-gray-700',
    tableBodyCellExpandedClass: 'bg-blue-50',
    cardWrapperClass: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
    cardControlsClass: 'flex items-center justify-between px-4 py-2',
    cardColumnClass: '',
    cardClass: 'rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
    cardExpandedClass: 'ring-2 ring-blue-300',
    cardSelectedClass: 'ring-2 ring-blue-500 bg-blue-50',
    cardRowClass: 'flex justify-between border-b border-gray-100 py-2 last:border-b-0',
    cardLabelClass: 'text-xs font-semibold text-gray-500 uppercase',
    cardValueClass: 'text-sm text-gray-800 text-right',
    cardValueExpandedClass: 'text-blue-700',
    selectionCheckboxWrapperClass: 'inline-flex items-center',
    selectionCheckMarkClass: 'hidden',
    sortableIconClass: 'cursor-pointer select-none text-gray-400 hover:text-gray-700 transition-colors',
    sortableIconAscClass: 'text-blue-600',
    sortableIconDescClass: 'text-blue-600',
    sortableIconNoneClass: 'text-gray-300',
    sortableColumnClass: 'cursor-pointer',
    noDataClass: 'py-8 text-center text-gray-400 text-sm',
    pagination: {
      infoClassTop: 'px-4 py-2 text-sm text-gray-500',
      infoClassBottom: 'px-4 py-2 text-sm text-gray-500',
      containerClass: 'flex items-center justify-center gap-1 py-3',
      pageClass: 'inline-flex items-center justify-center size-9 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors',
      pageLinkClass: '',
      activePageClass: 'bg-blue-600 text-white hover:bg-blue-700 font-semibold',
      prevClass: 'inline-flex items-center justify-center px-3 py-2 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors',
      prevLinkClass: '',
      nextClass: 'inline-flex items-center justify-center px-3 py-2 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors',
      nextLinkClass: '',
      disabledClass: 'opacity-40 pointer-events-none',
      breakViewClass: 'inline-flex items-center justify-center size-9 text-sm text-gray-400',
      breakViewLinkClass: '',
    },
  },
}

export function mergeConfig(defaults: RGridConfig, overrides: RGridOptions): RGridConfig {
  const merged = { ...defaults }

  for (const key of Object.keys(overrides) as (keyof RGridOptions)[]) {
    const val = overrides[key]
    if (val === undefined) continue

    if (key === 'styling' && typeof val === 'object') {
      const stylingOverride = val as DeepPartial<StylingConfig>
      merged.styling = {
        ...defaults.styling,
        ...stylingOverride,
        pagination: {
          ...defaults.styling.pagination,
          ...(stylingOverride.pagination ?? {}),
        },
      } as StylingConfig
    } else if (key === 'pagination' && typeof val === 'object') {
      merged.pagination = { ...defaults.pagination, ...val } as PaginationConfig
    } else if (key === 'sorting' && typeof val === 'object') {
      merged.sorting = { ...defaults.sorting, ...val } as SortingConfig
    } else if (key === 'selection' && typeof val === 'object') {
      merged.selection = { ...defaults.selection, ...val } as SelectionConfig
    } else if (key === 'responsive' && typeof val === 'object') {
      merged.responsive = { ...defaults.responsive, ...val } as ResponsiveConfig
    } else if (key === 'axios' && typeof val === 'object') {
      merged.axios = { ...defaults.axios, ...val } as AxiosRequestConfig
    } else {
      ;(merged as Record<string, unknown>)[key] = val
    }
  }

  return merged
}
