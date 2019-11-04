import Utils from './Utils';

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

  displayDetails(cellOrField, row) {
    const rowId = Utils.parseRowId(row);
    const field = Utils.parseCellField(cellOrField);

    if (!this.isDetailsExpanded(field, rowId)) {
      if (!this.grid.displayedDetails[rowId]) {
        this.grid.$set(this.grid.displayedDetails, rowId, []);
      }

      this.grid.displayedDetails[rowId].push(field);
    }
  }

  hideDetails(cellOrField, row) {
    const rowId = Utils.parseRowId(row);
    const field = Utils.parseCellField(cellOrField);

    if (this.isDetailsExpanded(field, rowId)) {
      this.grid.$set(
        this.grid.displayedDetails,
        rowId,
        this.grid.displayedDetails[rowId].filter(f => f !== field),
      );
    }
  }

  toggleDetails(cellOrField, row) {
    const rowId = Utils.parseRowId(row);
    const field = Utils.parseCellField(cellOrField);

    if (!this.isDetailsExpanded(field, rowId)) {
      this.displayDetails(field, rowId);
    } else {
      this.hideDetails(field, rowId);
    }
  }

  isDetailsExpanded(cellOrField, row) {
    const rowId = Utils.parseRowId(row);
    const field = Utils.parseCellField(cellOrField);

    return this.grid.displayedDetails[rowId] && this.grid.displayedDetails[rowId].includes(field);
  }
}
