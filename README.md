# resize-image-loader

**Images account for 58%<sup>[1][image-stats]</sup> of web pages. Hyper optimize your images to have massive improvement page load times.**

Resize-image-loader will create responsive images using webpack and [gm](http://aheckmann.github.io/gm/) so only the most effecient image is downloaded for the user's device. Modern browser have an additional attibute on the `img` tag called `srcset`. If `srcset` is supported the browser will use the device's screensize and pixel density to determine the best image to download. Older browsers will default back to the normal `src` image.  This will greatly improve page load times and time to first render while reducing the cost for the user<sup>[2][cost-site]</sup>.

## Sample Metrics
Check out the test folder for a sample use case. Below is the render times with the full image vs a responsive one and a placeholder image.


| image size | time to render on 3G connection |
| ------------- | ------------- |
| placeholder image (inlined & blurred) | 300 ms |
| 900 px width image (resized & optimized srcset) | 5,000 ms |
| regular image | 24,000 ms |


## Basic Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Use the sizes param of the resize-image-loader to set all the desired widths. The loader creates the various sized images and return the proper formated result for the `<img srcset>` property (including any file name changes for long term caching). This loader need to be set in the javascript source, not the webpack config file.

``` javascript
var imgset = require('resize-image?sizes[]=200w,sizes[]=900w!./myImage.jpg');
var img = require('./myImage.jpg')
...
render(){
  return <img 
    srcset={imgset} 
    src={img} 
    sizes="200w,900w" /> {/* Make sure to add the sizes manually as well. */}
}
```

## Advanced Usage

Optionally you make also create a placeholder image. Placeholder images are tiny images that are inlined and blurred until the hi-res image is loaded. This delivers a fully rendered experince to the user as quick as possible without empty boxes or jumpy reflow/layouts. [See facebook's write up for futher details.](https://code.facebook.com/posts/991252547593574/the-technology-behind-preview-photos)

The code below has one `img` using the placeholder image, which is inlined as a datauri. This will load right away and take up minimal space on the inital download (the sample project placeholder is 1.5K gzipped). The second image is the normal image. The user's browser will then choose the optimal image and download that one instead of the src. Once the full image loads, the onLoad handler will trigger a state change and have an animated cross fade between the blured placeholder image and the real hi-res image.

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

`placeholder=<image-width>` default _20_  
`blur=<gaussian-blur-amount>` default _40_  

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
