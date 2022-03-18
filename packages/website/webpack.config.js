const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const path = require('path');

module.exports = env => {
  let envPath = './.env';
  if (env.production) {
    envPath = './.env.prod';
  }
  if (env.uat) {
    envPath = './.env.uat';
  }

  return {
    mode: 'development',
    entry: './src/js/app.js',
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'themes/2020/static/js'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new Dotenv({
        path: envPath,
      }),
    ],
  };
};
