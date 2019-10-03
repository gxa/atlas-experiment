const path = require(`path`)
const { CleanWebpackPlugin } = require(`clean-webpack-plugin`)

const commonPublicPath = `/dist/`
const vendorsBundleName = `vendors`

module.exports = {
  entry: {
    experimentPage: [`@babel/polyfill`, `./src/index.js`]
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: `dist`
    })
  ],

  output: {
    library: `[name]`,
    filename: `[name].bundle.js`,
    publicPath: commonPublicPath
  },

  optimization: {
    runtimeChunk: {
       name: vendorsBundleName
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: vendorsBundleName,
          chunks: `all`
        }
      }
    }
  },

  resolve: {
    alias: {
      "react": path.resolve(`./node_modules/react`),
      "react-dom": path.resolve(`./node_modules/react-dom`),
      "prop-types": path.resolve(`./node_modules/prop-types`),
      "styled-components": path.resolve(`./node_modules/styled-components`),
      "react-router-dom": path.resolve(`./node_modules/react-router-dom`),
      "urijs": path.resolve(`./node_modules/urijs`),
      "lodash": path.resolve(`./node_modules/lodash`)
    }
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [ `style-loader`, `css-loader` ]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: `file-loader`,
            options: { query: { name: `[hash].[ext]`, hash: `sha512`, digest: `hex` } }
          },
          {
            loader: `image-webpack-loader`,
            options: {
              query: {
                bypassOnDebug: true,
                mozjpeg: { progressive: true },
                gifsicle: { interlaced: true },
                optipng: { optimizationLevel: 7 }
              }
            }
          }
        ]
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: `file-loader`,
            options: { query: { name: `[hash].[ext]`, hash: `sha512`, digest: `hex` } }
          }
        ]
      },
      {
        test: /\.js$/i,
        exclude: /node_modules\//,
        use: `babel-loader`
      }
    ]
  },

  devServer: {
    port: 9000,
    contentBase: path.resolve(__dirname, `html`),
    publicPath: commonPublicPath,
    historyApiFallback: true
  }
}
