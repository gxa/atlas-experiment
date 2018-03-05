var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    experimentPage: ['whatwg-fetch', './src/index.js'],
    dependencies: ['prop-types', 'react', 'react-bootstrap', 'react-dom', 'react-router-dom', 'rc-slider']
  },
  output: {
    libraryTarget: 'var',
    library: '[name]',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/gxa/resources/js-bundles/'
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {verbose: true, dry: false}),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'dependencies',
      filename: 'vendorCommons.bundle.js',
      minChunks: Infinity     // Explicit definition-based split. Don’t put shared modules between main and demo
    })                          // entries in vendor.bundle.js

  ],

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.less$/i,
        use: [ 'style-loader', 'css-loader', 'less-loader' ]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              query: {
                name: '[hash].[ext]',
                hash: 'sha512',
                digest: 'hex'
              }
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                bypassOnDebug: true,
                mozjpeg: {
                  progressive: true,
                },
                gifsicle: {
                  interlaced: true,
                },
                optipng: {
                  optimizationLevel: 7,
                }
              }
            }
          }
        ]
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              query: {
                name: '[hash].[ext]',
                hash: 'sha512',
                digest: 'hex'
              }
            }
          }
        ]
      },
      {
        test: /\.js$/i,
        exclude: /node_modules\//,
        use: 'babel-loader'
      }
    ]
  },

  devServer: {
    historyApiFallback: true,
    contentBase: "html",
    port: 9000
  }
};
