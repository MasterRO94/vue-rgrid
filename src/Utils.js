export default class Utils {
  static parseRowId(row) {
    return row && typeof row === 'object' ? row.id : row;
  }

  static parseCellField(cell) {
    return cell && typeof cell === 'object' ? cell.field : cell;
  }

  static upperFirstLetter(string = '') {
    if (!string) {
      return '';
    }

    return (string.charAt(0).toUpperCase() + string.substring(1)).replace(/_/g, ' ');
  }
}
