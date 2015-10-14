
export default {
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
