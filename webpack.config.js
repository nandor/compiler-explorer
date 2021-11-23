const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function(env, argv) {
  const prod = argv.mode === "production";

  return {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              envName: argv.mode
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader"
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "index.html")
      })
    ],
    resolve: {
      extensions: [".js", ".jsx"]
    },
    output: {
      publicPath: ''
    }
  };
};
