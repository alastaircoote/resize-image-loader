# resize-image-loader

Image resize loader module for responsive images in webpack

> Creates responsive images with [gm](http://aheckmann.github.io/gm/)

* To minify images use the [webpack-image-loader]()

## Install

* Install ImageMagick before installing the resize-imageloader

```sh
$ brew install ImageMagick // for mac
$ npm install resize-image-loader --save-dev
```

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Sizes are specific per image. This loader should be set per file in the require in your javascript source file.

``` javascript
var imgset = require('resize-image?sizes[]=200w,sizes[]=900w!./myImage.jpg');
var img = require('./myImage.jpg')
...
render(){
  return <img 
    srcset={imgset} 
    src={img} 
    sizes="200w,900w" />
}
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)