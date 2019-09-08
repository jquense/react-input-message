const path = require('path')

module.exports = {
  entry: path.join(__dirname, '../example/input-validator-example.jsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../example'),
    publicPath: '/'
  },
  devServer: {
    contentBase: [path.join(__dirname, '../example')],
    historyApiFallback: true,
    hot: true
},

  resolve: {
    alias: {
      'react-input-messages': path.join(__dirname, '../src')
    },
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      { test: /\.css$/,  loader: "style-loader!css-loader" },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
      {
        test: /\.jsx$|\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
}
