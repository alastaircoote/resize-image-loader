var gm = require('gm').subClass({ imageMagick: true });
var Datauri = require('datauri');
var fs = require('fs');
var loaderUtils = require('loader-utils');

module.exports = function(content) {
  var idx = this.loaderIndex;

  // ignore content from previous loader because it could be datauri
  content = fs.readFileSync(this.resourcePath);

  var query = (this.query !== '' ? this.query : this.loaders[0].query);
  query = loaderUtils.parseQuery(query);

  if (!query.sizes && !query.placeholder) {
    query = {sizes:['320w','960w','2048w']};
  }
  
  if (!Array.isArray(query.sizes)) {
    query.sizes = [sizes];
  }

  var callback = this.async(), called = false;

  if(!this.emitFile) throw new Error("emitFile is required from module system");
  var emitFile = this.emitFile;
  this.cacheable && this.cacheable();
  this.addDependency(this.resourcePath);

  if (this.debug === true && query.bypassOnDebug === true) {
    // Bypass processing while on watch mode
    return callback(null, content);
  } else {
    var paths = this.resourcePath.split('/');
    var name = paths[paths.length - 1].split('.')[0];
    var ext = paths[paths.length - 1].split('.')[1];
    var sizes = query.sizes.map(function(s){ 
      return s;
    });
    var files = sizes.map(function(size, i){
      return name + '-' + size + '.' + ext;
    });
    var imgset = files.map(function(file, i){
      return file + ' ' + sizes[i] + ' ';
    }).join(',');

    if (query.placeholder){
      query.placeholder = (query.placeholder > 5 ? query.placeholder : 200);
      if (!query.blur) {
        query.blur = 40;
      }
      var size = null;
      gm(content)
        .size(function(err, _size){ size = _size; })
        .resize(Math.max(query.placeholder, 20))
        .toBuffer(ext, function(err, buf){
          if (buf){
            var uri = new Datauri().format('.'+ext, buf).content;
            var blur =  "<svg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 "+size.width+" "+size.height+"'>" + 
                          "<defs><filter id='puppybits'><feGaussianBlur stdDeviation='"+query.blur+"'/></filter></defs>" +
                          "<image width='100%' height='100%' xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='" + uri + "' filter='url(#puppybits)'></image>" +
                        "</svg>";
            var micro = new Datauri().format('.svg', new Buffer(blur, 'utf8')).content; 
            callback(null, "module.exports = \""+micro+"\"");  
            called = true;
          }
      });
    } else /* return srcset*/ {
      var count = 0;
      var images = [];
      sizes.map(function(size, i){
        size = parseInt(size);
        gm(content)
          .resize(size)
          .toBuffer(ext, function(err, buf){
            if (buf){
              images[i] = buf;
              emitFile(files[i], buf);
            }
            
            count++;
            if (count >= files.length){
              callback(null, "module.exports = \""+imgset+"\"");  
              called = true;
            }    
        });
      });
    }
  }
};

module.exports.raw = true; // get buffer stream instead of utf8 string
