const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Don\'t supported subfolders');
  }

  const filepath = path.join(__dirname, 'files', pathname);

  const file = fs.createReadStream(filepath);

  file.on('error', (err) => {
    switch (err.code) {
      case 'ENOENT':
        res.statusCode = 404;
        res.end('file not exist');
        break;
      default:
        res.statusCode = 500;
        res.end('server\'s error');
    }
  });

  switch (req.method) {
    case 'GET':
      file.pipe(res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
