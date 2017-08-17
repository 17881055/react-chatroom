var path = require('path');
var webpack = require('webpack')
module.exports = {
    target: "web",
    stats: "errors-only", // 精确控制要显示的 bundle 信息
    devtool: 'source-map', //eval
    context: __dirname,
    entry: {
        bundle: './client/entry/index.js'
    },
    output: {
        path: path.resolve(__dirname, "public"),
        filename: './javascripts/bundle.js',
        publicPath: "",
    },
    devServer: {
        noInfo: true,
        https: false,
        port: 9600,
        hot: false,
        contentBase: './public/',
        historyApiFallback: true,
    },
    module: {
        rules: [{
            test: /\.js|\.jsx?$/,
            loader: 'babel-loader',
            include: [
                path.resolve(__dirname, "client")
            ],
            exclude: [
                path.resolve(__dirname, "node_modules")
            ],
            options: {
                presets: ["es2015", 'stage-0', "react"],
                plugins: [
                    /*  ['react-transform', {
                         transforms: [{
                             transform: 'react-transform-hmr',
                             imports: ['react'],
                             locals: ['module']
                         }, {
                             transform: 'react-transform-catch-errors',
                             imports: ['react', 'redbox-react']
                         }]
                     }], */
                    //["transform-decorators-legacy"],
                    //["transform-flow-strip-types"],  //强类型
                    ["import", {
                        "libraryName": "antd",
                        "style": true
                    }]
                ],
            },
        },
        {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        },
        {
            test: /\.less$/,
            loader: 'style-loader!css-loader!less-loader'
        }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin({
            // Options...
        })
    ],
};

