export default class Column {
  constructor(field, data = {}) {
    this.field = field;
    this.label = data.label || '';
    this.sortable = data.sortable || false;
    this.filterable = data.filterable || false;
  }

  static make(field, data = {}) {
    return new this(field, data);
  }
}
