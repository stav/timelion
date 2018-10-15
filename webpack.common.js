const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { HashedModuleIdsPlugin } = require('webpack');

module.exports = {
    entry: {
        main: path.resolve(__dirname, "src/main.js")
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: "/",
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js'
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules\/(.*)\.js/,
                    name: 'vendor',
                    chunks: "all"
                }
            }
        }
    },
    module: {
        rules: [{
            test: /(\.jsx|\.js)$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ["es2015"]
                }
            },
            exclude: /node_modules/,
            include: '/src/'
        }, {
            test: /(\.css|\.scss|\.sass)$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', {
                loader: 'postcss-loader',
                options: {
                    plugins: () => [require('autoprefixer')({
                        'browsers': ['> 1%', 'last 2 versions']
                    })]
                }

            }]
        }, {
            test: /\.(gif|jpg|png|ico)\??.*$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: '[name].[ext]',
                    publicPath: '../../',
                    outputPath: 'css/'
                }
            }
        }, {
            test: /\.(svg|woff|otf|ttf|eot)\??.*$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: '[name].[ext]',
                    publicPath: '../../',
                    outputPath: 'css/'
                }
            }
        }, {
            test: /\.html$/,
            use: {
                loader: 'html-loader',
                options: {
                    minimize: false,
                    removeComments: false,
                    collapseWhitespace: false
                }
            }
        }]
    },
    plugins: [
        //清空dist
        new HashedModuleIdsPlugin(),
        new CleanWebpackPlugin(["dist"], {
            root: '',
            verbose: true,
            dry: false
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, "src/img"),
            to: path.resolve(__dirname, "dist/img")
        }]),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[chunkhash].min.css',
            chunkFilename: 'css/[name].[chunkhash].css'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            hash: false,
            minify: {
                removeComments: false,
                collapseWhitespace: false
            }
        })

    ]
};
