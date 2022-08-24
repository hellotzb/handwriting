const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const outputPath = path.resolve(
  __dirname,
  process.env.NODE_ENV === 'production' ? 'dist' : 'dev'
);
// 向前兼容，支持旧版本
const entry = {
  admin: './src/widgets/qlive/admin/index.ts',
  client: './src/widgets/qlive/client/index.ts',
};

const getDirectories = src => {
  const directoryList = [];
  fs.readdirSync(src, { withFileTypes: true }).forEach(dir => {
    // 向前兼容，支持旧版本
    if (dir.isDirectory() && dir.name !== 'qlive') {
      directoryList.push(`${src}/${dir.name}`);
    }
  });
  return directoryList;
};

const dynamicDir = getDirectories('./src/widgets');
const staticDir = ['admin', 'client'];

for (let i = 0; i < dynamicDir.length; i++) {
  const key = dynamicDir[i].split('/').slice(-1);
  for (let j = 0; j < staticDir.length; j++) {
    const value = {
      import: `${dynamicDir[i]}/${staticDir[j]}/index.ts`,
      filename: `widgets/${key}/${staticDir[j]}.js`,
    };
    entry[`${key}-${staticDir[j]}`] = value;
  }
}

const config = {
  entry,
  output: {
    path: outputPath,
    library: ['tianxuan_widget', '[name]'],
    libraryTarget: 'umd2',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-loader'],
      },
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 50, // 基准大小
              remPrecision: 2, // remPrecision为转化后小数点后位数
            },
          },
          'less-loader',
        ],
      },
      // 资源模块(asset module)是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。
      {
        test: /\.(png|svg|jpg|gif|blob)$/,
        type: 'asset', // 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。
        generator: {
          filename: 'img/[hash][ext][query]', // 局部指定输出位置
        },
        parser: {
          dataUrlCondition: {
            maxSize: 1 * 1024, // 小于 1kb 的文件，将会视为 asset/inline 类型，否则会被视为 asset/resource 类型。
          },
        },
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [
              '@babel/env',
              {
                modules: false,
                targets: {
                  browsers: [
                    '> 1%',
                    'last 2 versions',
                    'not ie <= 8',
                    'chrome >= 70',
                    'safari >= 8',
                  ],
                },
              },
            ],
            '@babel/preset-react',
            ['@babel/preset-typescript', { allowNamespaces: true }],
          ],
          plugins: ['@babel/plugin-transform-runtime'], // 减少babel生成文件的体积
        },
      },
    ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  plugins: [
    new webpack.DefinePlugin({
      // webpack自带该插件，无需单独安装
      'process.browser': JSON.stringify(process.browser),
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks(chunk) {
            // exclude 旧版组件库，避免天璇配置需要添加 commons 包，以达到平滑升级的目的
            // 管理端代码不需要 commons 包，因为天璇侧管理端不会注入框架代码
            return (
              !staticDir.includes(chunk.name) && !/admin$/.test(chunk.name)
            );
          },
          minChunks: 3, // 当一个模块被应用至少3次才进行代码分割，当旧版的 qlive 组件库去掉后，这里改为 2
        },
      },
    },
  },
};

if (process.env.NODE_ENV !== 'production') {
  config.plugins.push(...[new BundleAnalyzerPlugin({ openAnalyzer: false })]);
}

module.exports = config;
