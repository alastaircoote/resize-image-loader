# resize-image-loader

**Images account for 58%<sup>[1][image-stats]</sup> of web pages. Hyper optimize your images to have massive improvement page load times.**

Creates responsive images with webpack and [gm](http://aheckmann.github.io/gm/) so only the most effecient image is downloaded for the user's device. This will improve page load times and time to first render while reducing the cost for the user<sup>[2][cost-site]</sup>.

## Basic Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Use the sizes param to set all the desired widths. The loader will return the proper format for the `<img srcset>` property (including any file name changes for long term caching). This loader need to be set in the javascript source.

IMPORTANT: Make sure to add the `sizes` property to the `img` tag manually.

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

## Advanced Usage

Optionally you make also create a placeholder image. Placeholder images are tiny images that are inlined and blurred until the hi-res image is loaded. This delivers a fully rendered experince to the user as quick as possible without empty boxes or jumpy reflow/layouts. 

The code below has one `img` using the placeholder image, which is inlined as a datauri. This will load right away and take up minimal space on the inital download. The second image is the normal image. The user's browser will choose which image is optimal and download that one instead of the src (on newer browsers). Once the full image loads, it will trigger a state change and have an animated a fade between the blured placeholder image and the real hi-res image.

``` javascript
var imgset = require('resize-image?sizes[]=200w,sizes[]=900w!./myImage.jpg');
var placeholder = (require('resize-image?placeholder!./myImage.jpg'));
var img = require('./myImage.jpg')
...
render(){
  return (<div style={{position:'relative'}}>
    <img 
      src={placeholder}
      style={{
        opacity:(this.state.imgLoaded ? 0 : 1),
        transition: 'opacity 300ms ease-out',
        position:'absolute'}} />
    <img 
      src={img} 
      srcset={imgset} 
      sizes="200w,900w"
      style={{
        opacity:(this.state.imgLoaded ? 1 : 0),
        transition: 'opacity 300ms ease-in',
        position:'absolute'}}
      onLoad={function(){ this.setState({imgLoaded:true}); }} />
  </div>);
}
```

*placeholder* options.  

`placeholder=<image-width>` default _200_  
`blur=<gaussian-blur-amount>` default _10_  

* To also compress images combine [resize-image-loader](https://github.com/Levelmoney/resize-image-loader) with the [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)
```
var imgset = require('image-webpack!resize-image?sizes[]=200w,sizes[]=900w!./myImage.jpg');
var img = require('image-webpack!./myImage.jpg')
```


## Installation

* Install ImageMagick before installing the resize-image-loader

```sh
$ brew install ImageMagick // for mac
$ npm install resize-image-loader --save-dev
```


## License

MIT (http://www.opensource.org/licenses/mit-license.php)

[image-stats]: http://royal.pingdom.com/2011/11/21/web-pages-getting-bloated-here-is-why/
[cost-site]: http://whatdoesmysitecost.com/
