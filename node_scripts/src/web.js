const http = require('http');

this.listen = function(callback, port) {
    http.createServer(function(req, res) {
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
