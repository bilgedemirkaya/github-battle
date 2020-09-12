// webpack.config.js
module.exports = {
    entry: './app/index.js',
    module: {
        rules: [
            /*
            the primary purpose of a loader,
            is to give webpack the ability to process more than just JavaScript and JSON files.
            */
            { test: /\.svg$/, use: 'svg-inline-loader' },
            /* After dowloading the loader, we need to add it to our webpack config */

            { test: /\.css$/, use: ['style-loader','css-loader'] }, 
            /* style loader should be before than css loader
            Webpack will process those in reverse order. So css-loader will interpret the import './styles.css' line
            then style-loader will inject that CSS into the DOM. */

            { test: /\.(js)$/, use: 'babel-loader' }
            /* Loaders can do more than just allow you to import certain file types.
            They’re also able to run transformations on files before they get added to the final output bundle. 
            The most popular is transforming “next generation JavaScript” to the JavaScript of today 
            that browsers can understand using Babel.*/
        ]
      },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js'
      },
      /* So the full process looks something like this.
      1-webpack grabs the entry point located at ./app/index.js.
      2- It examines all of our import and require statements and creates a dependency graph.
      3- webpack starts creating a bundle, whenever it comes across a path we have a loader for, 
      it transforms the code according to that loader then adds it to the bundle.
      4- It takes the final bundle and outputs it at dist/index_bundle.js.
 */
    plugins: [ 
        new HtmlWebpackPlugin(),
    ],
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}
