const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    output: {
        publicPath: './'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        compress: false,
        port: 9000,
        disableHostCheck: true,
        host: '0.0.0.0',
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_console: false,
                        booleans: false,
                        collapse_vars: false,
                        reduce_vars: false,
                        loops: false
                    },
                    output: {
                        comments: true,
                        beautify: true
                    }
                }
            }),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/,
                cssProcessor: require('cssnano')({ zindex: false }),
                cssProcessorOptions: {
                    discardComments: { removeAll: false }
                },
                canPrint: true
            }, {
                copyUnmodified: true
            })
        ]
    }
});
