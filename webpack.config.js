const config = {
    mode: 'production',
    entry: {
        index: './src/js/index.js',
    },

    output: {
        // path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module : {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    }
};

module.exports = config;