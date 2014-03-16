var moment = require('moment'),
    points = require('../points'),
    forecast = require('../forecast'),
    q = require('q'),
    V = 10;

/**
 * @param {{from: Number, to: Number, when: String}} order
 * @param {Function} callback
 */
exports.isOrderAcceptable = function (order, callback) {
    checkOrderFormat(order, function (err) {
        if (err) {
            callback(err);
            return;
        }
        getPointsAndWeather(order, function (err, data) {
            if (err) {
                callback(err);
                return;
            }
            var pointsAzimuth = 360 - getAzimuth(data[0], data[1]),
                weather = data[2];
            if (V > weather.magnitude) {
                callback(null, true);
            } else if (getForce(pointsAzimuth, V) > getForce(weather.azimuth, weather.magnitude)) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        });
    });
};

/**
 * @param {{from: Number, to: Number, when: String}} order
 * @param {Function} callback
 */
function checkOrderFormat (order, callback) {
    var errorMessage = getOrderErrorMessage(order),
        error = errorMessage ? new Error(errorMessage) : null;
    process.nextTick(function () {
        callback(error);
    });
}

/**
 * @param {{from: Number, to: Number, when: String}} order
 * @returns {String|null}
 */
function getOrderErrorMessage (order) {
    if (!order) {
        return 'Order must be an object';
    }
    if (!isFinite(order.from)) {
        return 'Field "from" must be a finite number';
    }
    if (!isFinite(order.to)) {
        return 'Field "to" must be a finite number';
    }
    if (order.to === order.from) {
        return 'To and from must be different points';
    }
    var date = moment(order.when);
    if (!date.isValid()) {
        return 'Field "when" must be a valid date';
    }
//todo: remove comment after tests
//    if (date.isBefore(new Date())) {
//        return 'Date of order must be in future';
//    }
    return null;
}

/**
 * @param {{from: Number, to: Number, when: String}} order
 * @param {Function} callback
 */
function getPointsAndWeather (order, callback) {
    q.all([
            q.nfcall(points.findById, order.from),
            q.nfcall(points.findById, order.to),
            q.nfcall(forecast.getWeather, order.when)
        ])
        .then(function (data) {
            callback(null, data);
        }, callback);
}

/**
 * @param {{absciss: Number, ordinate: Number}} pointA
 * @param {{absciss: Number, ordinate: Number}} pointB
 * @returns {Number}
 */
function getAzimuth (pointA, pointB) {
    var dX = pointB.absciss - pointA.absciss,
        dY = pointB.ordinate - pointA.ordinate,
        dist = Math.sqrt((dX * dX) + (dY * dY)),
        dXabs = Math.abs(dX),
        beta = Math.acos(dXabs / dist) * (180 / Math.PI),
        angle;
    if (dX > 0) {
        if (dY < 0) {
            angle = 270 + beta
        }
        else {
            angle = 270 - beta
        }
    }
    else if (dY < 0) {
        angle = 90 - beta
    }
    else {
        angle = 90 + beta
    }

    return angle;
}

/**
 * @param {Number} a
 * @param {Number} m
 * @returns {number}
 */
function getForce (a, m) {
    return m / Math.sin(a);
}