const express = require('express')
const app = express()

app.set('port', (process.env.PORT || 5000)); 

app.listen(app.get('port'), function () {
  console.log('Server has started! http://localhost:' + app.get('port') + '/');
});


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

app.get('/stream', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  const c = 0;
  const interval = setInterval(function() {
    res.write(JSON.stringify({ foo: Math.random() * 100, count: ++c }) + '\n');
    if (c === 10) {
      clearInterval(interval);
      res.end();
    }
  }, 200);
})

app.get('/about', function (req, res) {
  res.send('about')
})

// extracted from Express, used by `res.download()`
function contentDisposition(filename) {
  const ret = 'attachment';
  if (filename) {
    // if filename contains non-ascii characters, add a utf-8 version ala RFC 5987
    ret = /[^\040-\176]/.test(filename)
      ? 'attachment; filename="' + encodeURI(filename) + '"; filename*=UTF-8\'\'' + encodeURI(filename)
      : 'attachment; filename="' + filename + '"';
  }

  return ret;
}