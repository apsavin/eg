var ordersCheckingServiceServer = require('./lib/ordersCheckingService/server').server,
    orders = require('./lib/ordersCheckingService/orders');


require('./lib/forecast').connect(3110, '192.168.117.110');

ordersCheckingServiceServer.listen(7010);

var http = require('http');
http.createServer(function (req, res) {
    orders.get(function (err, data) {
        if (!err) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(data));
        } else {
            res.writeHead(404);
            res.end(http.STATUS_CODES[404]);
        }
    });
}).listen(1337);