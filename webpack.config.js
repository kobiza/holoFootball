var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        APP_DIR + '/index.jsx'
    ],
    output: {
        path: BUILD_DIR,
        publicPath: '/dist',
        filename: 'bundle.js'
    },
    devServer: {
        historyApiFallback: true
    },
    module : {
        loaders : [
            {
                test : /\.jsx?/,
                include : APP_DIR,
                loader : 'babel-loader'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader']
            }
        ]
    }
};

module.exports = config;
