const http = require('http');

this.listen = function(callback, port) {
    http.createServer(function(req, res) {
        console.log(new Date(), "[web] " + req.headers.host.split(":")[1] + " " + req.connection.remoteAddress + ": " + req.method + " " + req.url);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

        let data = "";

        req.on('data', (chunk) => {
            data += chunk.toString();
        });

        req.on('end', () => {
            callback(data);
            res.end();
        });
    }).listen(port);
}
