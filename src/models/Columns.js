import Column from './Column';

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
        label: (field.charAt(0).toUpperCase() + field.substring(1)).replace(/_/g, ' '),
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
