export default class RequestQueryFormatter {
  static format(obj) {
    const result = {};

    if (!Object.keys(obj).length) {
      return result;
    }

    Object.entries(obj).forEach((data) => {
      const [key, value] = data;

      if (value && typeof value === 'object') {
        Object.entries(value).forEach((subData) => {
          const [subKey, subValue] = subData;

          result[`${key}[${subKey}]`] = subValue;
        });
      } else {
        result[key] = value;
      }
    });

    return result;
  }
}
