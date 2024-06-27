const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "crypto": require.resolve("crypto-browserify")
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BASEURL': JSON.stringify(process.env.BASEURL),
      // Add other environment variables as needed
    })
  ],
  // other configurations
  // ...
};