//Remove the attributes in object that are not present in 'keys'
function filterObjectKeys(object, keys) {
    return Object.keys(object)
    .filter(key => keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = (object)[key];
      return obj;
    }, {});
}

exports.filterObjectKeys = filterObjectKeys;