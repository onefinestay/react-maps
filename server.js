var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname + '/demo')).listen(process.env.PORT);