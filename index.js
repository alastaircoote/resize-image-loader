var gm = require('gm').subClass({ imageMagick: true });
var Datauri = require('datauri');
var fs = require('fs');
var loaderUtils = require('loader-utils');

var defaultSizes = ['320w','960w','2048w'];
var defaultBlur = 40;
var defaultPlaceholderSize = 20;

function createPlaceholder(content, placeholder, ext, blur, callback){
  var size = null;
  gm(content)
    .resize(placeholder)
    .size(function(err, _size){ size = _size; })
    .toBuffer(ext, function(err, buf){
      if (!buf) return;

      var uri = new Datauri().format('.'+ext, buf).content;
      var blur =  "<svg xmlns='http://www.w3.org/2000/svg' width='100%' viewBox='0 0 " + size.width + " " + size.height + "'>" +
                    "<defs><filter id='puppybits'><feGaussianBlur in='SourceGraphic' stdDeviation='" + defaultBlur + "'/></filter></defs>" +
                    "<image width='100%' height='100%' xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='" + uri + "' filter='url(#puppybits)'></image>" +
                  "</svg>";
      var micro = new Datauri().format('.svg', new Buffer(blur, 'utf8')).content;
      callback(null, "module.exports = \""+micro+"\"");
  });
}

function createResponsiveImages(content, sizes, ext, files, emitFile, addProportion, callback){
  var count = 0;
  var images = [];
  var imgset = files.map(function(file, i){ return file + ' ' + sizes[i] + ' '; }).join(',');

  sizes.map(function(size, i){
    size = parseInt(size);
    var originalSize = null;
    gm(content)
      .size(function(err,size) {
          originalSize = size;
      })
      .resize(size)
      .toBuffer(ext, function(err, buf){
        if (buf){
          images[i] = buf;
          emitFile(files[i], buf);
        }

        count++;
        if (count >= files.length) {
        
          if (!addProportion) {
              callback(null, "module.exports = \""+imgset+"\"");
          } else {
              var proportion = originalSize.height / originalSize.width;
              callback(null, "module.exports = "+ JSON.stringify({srcset: imgset, proportion: proportion}));
          }

        }
    });
  });
}

module.exports = function(content) {
  var idx = this.loaderIndex;

  // ignore content from previous loader because it could be datauri
  content = fs.readFileSync(this.resourcePath);

  var query = (this.query !== '' ? this.query : this.loaders[0].query);
  query = loaderUtils.parseQuery(query);

  query.sizes = (!Array.isArray(query.sizes) && [sizes]) || query.sizes || defaultSizes;

  var callback = this.async();
  if(!this.emitFile) throw new Error("emitFile is required from module system");
  this.cacheable && this.cacheable();
  this.addDependency(this.resourcePath);

  if (this.debug === true && query.bypassOnDebug === true) {
    // Bypass processing while on watch mode
    return callback(null, content);
  } else {
    var paths = this.resourcePath.split('/');
    var name = paths[paths.length - 1].split('.')[0];
    var ext = paths[paths.length - 1].split('.')[1];
    var sizes = query.sizes.map(function(s){ return s; });
    var files = sizes.map(function(size, i){ return name + '-' + size + '.' + ext; });

    if (query.placeholder) {
      query.placeholder = parseInt(query.placeholder) || defaultPlaceholderSize;
      query.blur = query.blur || defaultBlur;

      createPlaceholder(content, query.placeholder, ext, query.blur, callback);
    } else /* return srcset*/ {

      var emitFile = this.emitFile;
      createResponsiveImages(content, sizes, ext, files, emitFile, query.proportion, callback);
    }
  }
};

module.exports.raw = true; // get buffer stream instead of utf8 string
