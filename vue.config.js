module.exports = {
    chainWebpack: config => {
        config.module
            .rule('wasm')
            .test(/\.wasm$/)
            .type('javascript/auto')
            .use('file-loader')
            .loader('file-loader')
            .tap(() => {
                // modify the options...
                return {
                    outputPath: 'js',
                    name: '[name].[ext]'
                }
            })
    }
}