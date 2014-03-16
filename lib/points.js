//todo: database
var collection = [
    {id: 7, absciss: 10, ordinate: 10},
    {id: 8, absciss: 10, ordinate: 50},
    {id: 9, absciss: 60, ordinate: 50}
];

/**
 * @param {Number} id
 * @param {Function} callback
 */
exports.findById = function (id, callback) {
    var point;
    for (var i = 0, l = collection.length; i < l; i++) {
        if (collection[i].id === id) {
            point = collection[i];
            break;
        }
    }
    process.nextTick(function () {
        callback(point ? null : new Error('Not found'), point);
    });
};