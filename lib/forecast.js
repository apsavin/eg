var upnode = require('upnode'),
    forecast;

/**
 * @param {String|Date|Number} date
 * @param {Function} callback
 */
exports.getWeather = function (date, callback) {
    if (!forecast) {
        process.nextTick(function () {
            callback(new Error('Please call connect method before getWheather'));
        })
    }
    forecast(function (remote) {
        remote.forecast(new Date(date).getTime(), function (err, weather) {
            if (!err) {
                var errorMessage = checkWeather(weather);
                err = errorMessage ? new Error(errorMessage) : null;
            }
            console.log(weather);
            callback(err, weather);
        });
    });
};

/**
 * @param {Number} port
 * @param {String} host
 */
exports.connect = function (port, host) {
    forecast = upnode.connect(port, host);
};

/**
 * @param {{azimuth: Number, magnitude: Number}} weather
 * @returns {String|null}
 */
function checkWeather (weather) {
    if (!weather) {
        return 'Weather must be an object';
    }
    if (!isFinite(weather.azimuth)) {
        return 'Invalid weather azimuth';
    }
    if (!isFinite(weather.magnitude)) {
        return 'Invalid weather magnitude';
    }
    return null;
}