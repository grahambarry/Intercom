const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: './getCustomersWithinRadius.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './getCustomersWithinRadius_Bundled.js',
    libraryTarget: 'window'
  }
};