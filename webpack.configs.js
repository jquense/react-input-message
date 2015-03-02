
var config = {
      experimental: true,
      loose: ['all'],

      whitelist: [
        'es6.classes',
        'es6.modules',
        'es6.blockScoping',
        'es6.arrowFunctions',
        'es6.properties.computed',
        'es6.properties.shorthand',
        'es6.parameters.default',
        'es6.parameters.rest',
        'es6.templateLiterals',
        'es7.objectRestSpread',
        'react'
      ]
    }

module.exports = {

  to5Config: config,

  dev: {
    devtool: 'source-map',
    entry: './dev/input-validator-example.jsx',
    output: {
      filename: 'bundle.js',
      path: __dirname
    },

    resolve: {
      extensions: ['', '.js', '.jsx']
    },

    module: {
      loaders: [
        { test: /\.css$/,  loader: "style-loader!css-loader" },
        { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
        { 
          test: /\.jsx$|\.js$/, 
          loader: 'babel-loader', 
          exclude: /node_modules/,
          query: config
        }
      ]
    },
  },

  test: {
    devtool: 'inline-source-map',
    cache: true,
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        { test: /\.css$/, loader: "style-loader!css-loader" },
        { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
        { test: /sinon-chai/, loader: "imports?define=>false" },
        { 
          test: /\.jsx$|\.js$/, 
          loader: 'babel-loader', 
          exclude: /node_modules/,
          query: config
        }
      ]
    },
  }
}