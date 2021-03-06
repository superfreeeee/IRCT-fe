const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');

const isProd = process.env.NODE_ENV === 'production';

const config = {
  mode: process.env.NODE_ENV,
  entry: path.join(__dirname, 'src/index'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-[chunkhash].js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@layouts': path.resolve(__dirname, 'src/layouts'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@libs': path.resolve(__dirname, 'src/libs'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.module.(sass|scss)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
              sourceMap: true,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
              limit: 8192,
            },
          },
        ],
      },
      // 视频
      {
        test: /\.(mov|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'video/[name].[ext]',
              limit: 0,
            },
          },
        ],
      },
      // 字体类型
      {
        test: /\.(ttf|otf|eot|woff)$/,
        type: 'asset/resource',
        dependency: { not: ['url'] },
      },
    ],
  },
  plugins: [
    new WebpackBar(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Crafteam',
      template: './public/index.html',
      filename: 'index.html',
      favicon: './public/favicon32.png',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
    client: {
      overlay: true,
    },
  },
};

// source map
if (!isProd) {
  config.devtool = 'source-map';
}

module.exports = config;
