var gm = require('gm').subClass({ imageMagick: true });
var loaderUtils = require('loader-utils');


module.exports = function(content) {
  var idx = this.loaderIndex;
  var query = (this.query !== '' ? this.query: this.loaders[0].query);
  query = loaderUtils.parseQuery(query);
  if (!query.sizes) throw new Error("image-resize-loader requires a sizes argument. (ie sizes[]=200w)");
  
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
            callback(null, content);  
            called = true;
          }    
      });
    });
  }
};

module.exports.raw = true; // get buffer stream instead of utf8 string
