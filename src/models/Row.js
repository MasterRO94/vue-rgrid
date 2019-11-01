import hash from 'object-hash';
import Cell from './Cell';

export default class Row {
  constructor(columns = [], config = {}) {
    this.config = config;
    this.columns = Row.prepareColumns(columns);
    this.defineId();
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

    Object.entries(columns).forEach((column) => {
      cells[column[0]] = Cell.make(column[0], column[1]);
    });

    return cells;
  }
}
