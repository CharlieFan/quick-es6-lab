const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const fs = require('fs')

const extractSass = new ExtractTextPlugin({
    filename: '[name].css',
    disable: process.env.NODE_ENV === 'development',
    allChunks: true
})

// define the entries
let entries = {
    'index': path.join(__dirname, '/src/index')
}

let templates = fs.readdirSync('./src').filter(item => {
    return /\.html/.test(item)
})

let entryJsFiles = fs.readdirSync('./src/app').filter(item => {
    return /\.js/.test(item)
})

// production plugins
let pluginList = [
    extractSass
]

// dev plugins
let devPlugins = [
    new webpack.HotModuleReplacementPlugin()
]

// initiate entires
entryJsFiles.forEach(file => {
    let filename = path.basename(file, '.js')
    entries[filename] = path.join(__dirname, `/src/app/${filename}`)
})

// prepare htmls plugins
templates.forEach(file => {
    let filename = path.basename(file, '.html')
    pluginList.push(
        new HtmlWebpackPlugin({
            template: `${__dirname}/src/${filename}.html`,
            filename: `${filename}.html`,
            chunks: [`${filename}`]
        })
    )
    devPlugins.push(
        new HtmlWebpackPlugin({
            template: `${__dirname}/src/${filename}.html`,
            filename: `${filename}.html`
        })
    )
})

console.log(entries)

if (process.env.NODE_ENV === 'production') {
    module.exports = {
        entry: entries,
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist')
        },
        resolve: {
            extensions: ['.js']
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: extractSass.extract({
                        use: [
                            {
                                loader: 'css-loader'
                            },
                            {
                                loader: 'sass-loader'
                            }
                        ],
                        fallback: 'style-loader'
                    })
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader'
                }
            ]
        },
        plugins: pluginList,
        devServer: {
            contentBase: './dist',
            hot: true
        }
    }
}

if (process.env.NODE_ENV === 'development') {
    module.exports = {
        entry: './src/index.js',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['.js']
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader'
                }
            ]
        },
        plugins: devPlugins,
        devServer: {
            contentBase: './dist',
            hot: true
        }
    }
}
