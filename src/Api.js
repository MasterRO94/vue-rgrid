export default class Api {
  constructor(grid) {
    this.grid = grid;
  }

  static make(grid) {
    return new this(grid);
  }

  addColumn(field, column, redraw = true) {
    this.grid.data.columns.add(field, column);

    if (redraw) {
      this.redraw();
    }
  }

  removeColumn(field, redraw = true) {
    this.grid.data.columns.remove(field);

    if (redraw) {
      this.redraw();
    }
  }

  page(page = 1) {
    this.grid.pagination.currentPage = page;
    this.grid.handlePagination(page);
  }

  nextPage() {
    this.grid.handlePagination(this.grid.pagination.currentPage + 1);
  }

  prevPage() {
    this.grid.handlePagination(this.grid.pagination.currentPage - 1);
  }

  perPage(perPage) {
    this.grid.pagination.currentPage = 1;
    this.grid.pagination.perPage = perPage;
    this.grid.handlePagination(this.grid.pagination.currentPage);
  }

  redraw() {
    this.grid.redraw();
  }

  reload() {
    this.grid.init(true);
  }

  displayDetails(cell, row) {
    const rowId = Api.parseRowId(row);
    const field = Api.parseCellField(cell);

    if (!this.isDetailsExpanded(field, rowId)) {
      if (!this.grid.displayedDetails[rowId]) {
        this.grid.$set(this.grid.displayedDetails, rowId, []);
      }

      this.grid.displayedDetails[rowId].push(field);
    }
  }

  hideDetails(cell, row) {
    const rowId = Api.parseRowId(row);
    const field = Api.parseCellField(cell);

    if (this.isDetailsExpanded(field, rowId)) {
      this.grid.$set(
        this.grid.displayedDetails,
        rowId,
        this.grid.displayedDetails[rowId].filter(f => f !== field),
      );
    }
  }

  toggleDetails(cell, row) {
    const rowId = Api.parseRowId(row);
    const field = Api.parseCellField(cell);

    if (!this.isDetailsExpanded(field, rowId)) {
      this.displayDetails(field, rowId);
    } else {
      this.hideDetails(field, rowId);
    }
  }

  isDetailsExpanded(cell, row) {
    const rowId = Api.parseRowId(row);
    const field = Api.parseCellField(cell);

    return this.grid.displayedDetails[rowId] && this.grid.displayedDetails[rowId].includes(field);
  }

  static parseRowId(row) {
    return row && typeof row === 'object' ? row.id : row;
  }

  static parseCellField(cell) {
    return cell && typeof cell === 'object' ? cell.field : cell;
  }
}
