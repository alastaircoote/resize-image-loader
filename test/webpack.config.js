'use strict';
var path = require('path');
var webpack = require('webpack');

module.exports = [
  {
    name: 'test-image-resize',
    entry: './test/app.js',
    output: {
      path: path.join(__dirname, 'public'),
      publicPath: '/',
      filename: 'app.js'
    },
    resolve: {
      extensions: ['', '.js']
    },
    module: {
      loaders: [
      {
        test: /.*\.(gif|png|jpg|svg)$/, 
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]', 
          '../index.js']},
      ]
    }
  }
];
