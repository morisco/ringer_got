var zlib = require('zlib');
var fs = require('fs');

var gzip = zlib.createGzip();
var r = fs.createReadStream('./indexpz.html');
var w = fs.createWriteStream('./index.html');
r.pipe(gzip).pipe(w);