module.exports = checkObject = (val = {}) => {
    if (typeof val !== 'object') return false;
    if (Object.keys(val).length != 0 && val != undefined && val != null && val != '') return true;
    return false;
}

module.exports = checkParam = (val) => {
    if (val != null && val !== '' && val != undefined) return true;
    return false;
}