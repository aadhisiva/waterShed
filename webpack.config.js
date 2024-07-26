/* eslint-disable no-undef */
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename:  '[name].[contenthash].js',
    publicPath: '/watershed/',
  },
  devServer: {
    hot: true,
    compress: true,
    historyApiFallback: true, // It prevents the reload issue and direct searching by paths.
  },
  optimization: {
    usedExports: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 10000,
              esModule: false
            },
          },
        ]
      },
    ],
  },
};
