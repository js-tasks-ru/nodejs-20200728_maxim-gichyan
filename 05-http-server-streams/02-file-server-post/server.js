const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const limit_stream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (path.parse(pathname).dir !== '') {
    res.statusCode = 400;
    res.end();
  } else {
    const filepath = path.join(__dirname, 'files', pathname);
    switch (req.method) {
      case 'POST':
        if (fs.existsSync(filepath)) {
          res.statusCode = 409;
          res.end();
        } else {
          const writeFile = fs.createWriteStream(filepath);
          req
            .on('error', (err) => {
              writeFile.destroy();
              res.statusCode = 500;
              res.statusCode = 500;
              res.end();
              res.end();
            })
            .on('aborted', () => {
              writeFile.destroy();
              fs.unlinkSync(filepath);
            })
            .pipe(new limit_stream({ limit: 1000000 }))
            .on('error', (err) => {
              err.code === 'LIMIT_EXCEEDED'
                ? (res.statusCode = 413)
                : (res.statusCode = 500);
              writeFile.destroy();
              fs.unlinkSync(filepath);
              res.end();
            })
            .pipe(writeFile)
            .on('error', (err) => {
              res.statusCode = 500;
              res.end();
            })
            .on('finish', () => {
              res.statusCode = 201;
              res.end();
            });
        }
        break;

      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  }
});

module.exports = server;
