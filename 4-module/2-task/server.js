const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const stream = require('stream');

const server = new http.Server();

const response = (res, status = 200, body) => {
  if (!res) return null;

  res.statusCode = status;
  res.end(body);
};

const unlinkError = (err) => {
  if (err && err.code !== 'ENOENT') throw err;
};

const errorWriteFile = (res, file, err) => {
  if (err) {
    switch (err.code) {
      case 'LIMIT_EXCEEDED':
        fs.unlink(file.path, unlinkError);
        response(res, 413, 'LIMIT_EXCEEDED');
        break;

      case 'ERR_STREAM_PREMATURE_CLOSE':
        fs.unlink(file.path, unlinkError);
        break;

      default:
        response(res, 500, 'Server\'s error');
    }
  } else {
    response(res, 201, 'file saved!');
  }
};

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('file exists');
      } else {
        const limitSizeStream = new LimitSizeStream({limit: 1000000});
        const newFile = fs.createWriteStream(filepath);

        stream.finished(req, errorWriteFile.bind(this, res, newFile));

        req
            .on('error', errorWriteFile.bind(this, res, newFile))
            .pipe(limitSizeStream)
            .on('error', errorWriteFile.bind(this, res, newFile))
            .pipe(newFile)
            .on('error', errorWriteFile.bind(this, res, newFile));
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
