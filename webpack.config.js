var webpack = require("webpack");


module.exports = {
  entry: './demo/js/demo.js',
  output: {
    filename: './demo/js/build/bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?harmony&insertPragma=React.DOM' } // loaders can take parameters as a querystring
    ]
  },
  plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],

  resolve: {
    // you can now require('file') instead of require('file.coffee')
    extensions: ['', '.js', '.json'],
    alias: {
      'react-maps': '../../lib/index'
    }
  }
};
