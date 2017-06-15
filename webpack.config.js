const { DefinePlugin } = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new DefinePlugin({
      DEBUG: true,
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
};
