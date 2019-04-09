module.exports={
    entry:'./src/app/index.js',
    output:{
        path:__dirname+'/src/public',
        filename:'bundle.js'
    },
    module:{
        rules:[{
            use:{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env',
                              '@babel/preset-react',{
                              'plugins': ['@babel/plugin-proposal-class-properties']}]
                }
            },
            test: /\.js$/,
            exclude:/node_modules/
        }]
    }
};