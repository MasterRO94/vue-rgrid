import Column from './Column';
import Utils from '../Utils';

export default class Columns {
  constructor(columns = {}) {
    this.prepareColumns(columns);
  }

  static make(columns = {}) {
    return new this(columns);
  }

  static makeFromRow(row) {
    const columns = {};

    Object.keys(row.columns).forEach((field) => {
      columns[field] = Column.make(field, {
        label: Utils.upperFirstLetter(field),
      });
    });

    return new this(columns);
  }

  prepareColumns(columns) {
    this.columns = {};
    Object.entries(columns).forEach((data) => {
      this.columns[data[0]] = Column.make(data[0], data[1] || {});
    });
  }

  isEmpty() {
    return !Object.keys(this.columns).length;
  }

  add(field, data) {
    this.columns[field] = Column.make(field, data);
  }

  remove(field) {
    delete this.columns[field];
  }

  count() {
    return Object.keys(this.columns).length;
  }
}
