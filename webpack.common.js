const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  // ① production-生产环境(压缩代码)  ② development-开发环境(不压缩)
  mode: 'production', //入口文件
  entry: {
    // index: ['./src/index.js', './src/add.js']
    main: './src/index.js',
    common: './src/common.js',
  },
  watch: true, // webpack 将继续监听任何已解析文件的更改(webpack-dev-server 和 webpack-dev-middleware 里 watch 模式默认开启)
  // webpack-dev-server -> https://coding.imooc.com/lesson/316.html#mid=22333
  devServer: {
    contentBase: './dist', // 服务器启动在dist目录下
    open: true, // 运行webpack-dev-server的时候会自动打开浏览器并访问服务器的地址
    hot: true, // 开启HMR热模块替换
    proxy: {
      // 请求转发
      // /react/api/header.json -> http://www.tzbweb.com/demo.json
      '/react/api': {
        target: 'http://www.tzbweb.com',
        secure: false, // 实现对https网址请求的转发
        pathRewrite: {
          'header.json': 'demo.json',
        },
        // 默认情况下，代理时会保留主机头的来源，可以将 changeOrigin 设置为 true 以覆盖此行为。
        changeOrigin: true,
        historyApiFallback: true,
        headers: {}, // 自定义请求头
      },
    },
  },
  devtool: 'source-map', // 开发环境默认开启source-map
  resolveLoader: {
    modules: ['node_modules', './loaders'], // 使用loader的时候先去node_modules中查找,没有的话再去./loaders中查找
  }, // 处理非JS文件的配置
  // loader的执行顺序是从下到上，从右到左
  module: {
    rules: [
      {
        test: /\.(css|sass)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // 在css中通过import引入之前引用的loader数目
              // 0 => no loaders (default);
              // 1 => sass-loader;
              // 2 => sass-loader，postcss-loader;
              importLoaders: 1,
              // 开启css module模块化打包
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
              // 坑！！解决资源路径为[object Module]的问题
              esModule: false,
            },
          },
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer', // 自动添加厂商前缀
                    {
                      // 选项
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            // 设置打包出来图片的名字和后缀和原来的相同
            name: '[name].[ext]', // 打包后的图片放到dist目录下的images文件夹中
            outputPath: 'images/',
          },
        },
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    // 启用es6的转换
                    useBuiltIns: 'usage', // 按需引入babel/polyfill，兼容低版本浏览器(@babel/polyfill仍然需要安装)
                  },
                ],
              ],
            },
          },
          'eslint-loader', // 打包js文件之前先进行eslint代码检测(延缓打包速度，推荐在git钩子中做eslint)
        ],
      },
      // 打包 typescript 文件
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  plugins: [
    // HtmlWebpackPlugin 会在打包结束后自动生成一个html文件，并把打包生成的js自动引入到html中
    new HtmlWebpackPlugin({
      template: 'src/index.html', // html模板文件
    }),
    // 每次打包默认情况下，这个插件将删除 webpack 的 output.path 目录中的所有文件
    new CleanWebpackPlugin(),
    // 从 webpack-dev-server v4 开始，HMR 是默认启用的。它会自动应用 webpack.HotModuleReplacementPlugin
    new webpack.HotModuleReplacementPlugin(),
  ],
  // 优化
  optimization: {
    usedExports: true, // 开启Tree Shaking，production 模式下默认开启
  },
  // 设置模块如何被解析
  resolve: {
    // 按顺序解析后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
    extensions: ['.js', '.json', '.wasm'], // import File from './src/file';
  }, //输出
  output: {
    // 打包后的js路径中的基础路径
    publicPath: '/', // <script src="/main.js"></script> //输出的路径
    path: path.resolve(__dirname, 'dist'), //输出的文件名称
    filename: '[name].js', // [name]对应entry的key值
    chunkFilename: '[name].chunk.js', // 非初始（non-initial）chunk 文件的名称
  },
};
