const path = require('path');

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const nodeExternals = require('webpack-node-externals');

const webpackConfigClient ={
  name: "client",
  entry: {
    client: path.resolve(__dirname, "client/index.tsx"),
  },
  watch: true,
  mode: "production",
  output: {
    path: path.resolve(__dirname + "/dist/static"),
    filename: "[name].[contenthash].js",
    publicPath: "",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: path.resolve(__dirname, "tsconfig.json"),
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  target: "web",
  externals: [nodeExternals({
    allowlist: ['uglify-js']
  })],
  plugins: [new CleanWebpackPlugin(), new WebpackManifestPlugin()]
};

export default webpackConfigClient;
