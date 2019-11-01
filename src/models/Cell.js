export default class Cell {
  constructor(field = '', value = '', config = {}) {
    this.field = field;
    this.value = value;
    this.config = config;
  }

  static make(field = '', value = '', config = {}) {
    return new this(field, value, config);
  }

  setValue(value) {
    this.value = value;

    return this;
  }

  setField(field) {
    this.field = field;

    return this;
  }

  setConfig(config) {
    this.config = config;

    return this;
  }
}
