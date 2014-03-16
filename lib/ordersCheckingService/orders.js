//todo: database
var orders = [];

/**
 * @param {Object} orderInfo
 */
exports.insert = function (orderInfo) {
    orders.push(orderInfo);
};

/**
 * @param {Function} callback
 */
exports.get = function (callback) {
    process.nextTick(function () {
        callback(null, orders);
    })
};