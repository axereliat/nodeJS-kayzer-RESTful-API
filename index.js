const http = require('http');
const port = Number(process.env.PORT || 4000);
const app = require('./app');

const server = http.createServer(app);
server.listen(port);

console.log('Listening on port ' + port + '...');