var upnode = require('upnode'),
    orders = require('./orders'),
    isOrderAcceptable = require('./service').isOrderAcceptable;

var server = upnode(function () {

    /**
     * @param {{from: Number, to: Number, when: String}} order
     * @param {Function} callback
     */
    this.try = function (order, callback) {
        console.log(order);
        isOrderAcceptable(order, function (err, isAcceptable) {
                var accepted = !!isAcceptable,
                    response = {
                        order: order,
                        accepted: accepted,
                        error: err ? (err.message || JSON.stringify(err)) : null
                    };
                console.log(response);
                orders.insert(response);
                callback(err, accepted);
            }
        );
    };
});

exports.server = server;