import path from 'path'

export default {
  devtool: 'source-map',
  entry: './example/input-validator-example.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../example')
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
}
