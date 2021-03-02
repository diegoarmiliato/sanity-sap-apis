const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // bundling mode
  mode: 'production',
  // entry files
  entry: './src/server.ts',
  // output bundles (location)
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js',
  },
  // file resolutions
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // loaders
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['build']
    })
  ],
  target: 'node'
};
