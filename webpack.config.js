/*
  KULeuven/LIBIS (c) 2022
  Mehmet Celik mehmet(dot)celik(at)kuleuven(dot)be
*/
// Generated using webpack-cli https://github.com/webpack/webpack-cli
const PackageJSON = require('./package.json');
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { resolve } = require('path');

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;
const relDistDir = `dist/${PackageJSON.primo.institution}-${PackageJSON.primo.vidId}`;
const distDir = path.resolve(__dirname, relDistDir);

const config = {    
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, `${distDir}/js`),
    filename: 'custom.js',
    clean: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `../css/custom1.css`,
      chunkFilename: "[id].css"
    }),
    new CopyPlugin({
      patterns: [
        { from: "resources/general", to: distDir, noErrorOnMissing: true },
        { from: `resources/${PackageJSON.primo.institution}-${PackageJSON.primo.vidId}`, to: distDir, noErrorOnMissing: true }
      ]
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            "plugins": [
              "import-directory",
              "@babel/plugin-transform-runtime"
            ],
            "presets": [
              [
                "@babel/preset-env",
                {
                  "targets": "defaults"
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.(scss|css)$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      // {
      //   test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
      //   use: {
      //     loader: "url-loader"
      //   }
      // },
      {
        test: /\.(html)$/i,
        loader: "html-loader",
      },
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";    
  } else {
    config.mode = "development";
    config.devtool= 'source-map';
  }
  return config;
};