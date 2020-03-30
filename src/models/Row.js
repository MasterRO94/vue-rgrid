import hash from 'object-hash';
import Cell from './Cell';

export default class Row {
  constructor(columns = [], config = {}) {
    this.config = config;
    this.rawColumns = columns;
    this.columns = Row.prepareColumns(columns);
    this.defineId();
    this.selectable = typeof this.config.canSelectRowHandler === 'function'
      ? this.config.canSelectRowHandler(this)
      : false;
  }

  static make(columns = [], config = {}) {
    return new this(columns, config);
  }

  defineId() {
    if (this.config.idField && this.columns[this.config.idField]) {
      this.id = this.columns[this.config.idField].value;
    } else {
      this.id = hash(this.columns);
    }
  }

  static prepareColumns(columns = []) {
    const cells = {};

    Object.entries(columns).forEach(([field, value]) => {
      cells[field] = Cell.make(field, value);
    });

    return cells;
  }
}
