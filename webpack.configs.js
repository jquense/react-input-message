
module.exports = {

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
          exclude: /node_modules/
        }
      ]
    },
  },

  test: {
    devtool: 'inline-source-map',
    cache: true,

    entry: './_test.js',

    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    
    module: {
      loaders: [
        { test: /sinon-chai/, loader: "imports?define=>false" },
        { 
          test: /\.jsx$|\.js$/, 
          loader: 'babel-loader', 
          exclude: /node_modules/
        }
      ]
    },
  }
}