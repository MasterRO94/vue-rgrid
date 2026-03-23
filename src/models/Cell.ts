export interface CellConfig {
  [key: string]: unknown
}

export class Cell {
  field: string
  value: unknown
  config: CellConfig

  constructor(field = '', value: unknown = '', config: CellConfig = {}) {
    this.field = field
    this.value = value
    this.config = config
  }

  static make(field = '', value: unknown = '', config: CellConfig = {}): Cell {
    return new Cell(field, value, config)
  }

  setValue(value: unknown): this {
    this.value = value
    return this
  }

  setField(field: string): this {
    this.field = field
    return this
  }

  setConfig(config: CellConfig): this {
    this.config = config
    return this
  }

  toString(): string {
    return String(this.value ?? '')
  }
}
