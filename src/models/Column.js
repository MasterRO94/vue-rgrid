export default class Column {
  constructor(field, data = {}) {
    this.field = field;
    this.label = data.label || '';
    this.sortable = data.sortable || false;

    // null - no-sort; sorting will be switched in specified order.
    this.sortableVariants = data.sortableVariants || [null, 'asc', 'desc'];

    this.filterable = data.filterable || false;
    this.html = data.html || false;
  }

  static make(field, data = {}) {
    return new this(field, data);
  }
}
