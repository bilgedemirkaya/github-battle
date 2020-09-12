Why does webpack Exist?
At its core, webpack is a module bundler. It examines all of the modules in your application, creates a dependency graph, then intelligently puts all of them together into one or more bundle(s) that your index.html file can reference.

App.js --->     |         |
Dashboard.js -> | Bundler | -> bundle.js
About.js --->   |         |
What problem is webpack solving?
Historically when building a JavaScript application, your JavaScript code would be separated by files (these files may or may not have been actual modules). Then in your index.html file, you’d have to include <script> tags to every JavaScript file you had.

<body>

  ...

  <script src="http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
  <script src="libs/react.min.js"></script>
  <script src='src/admin.js'></script>
  <script src='src/dashboard.js'></script>
  <script src='src/api.js'></script>
  <script src='src/auth.js'></script>
  <script src='src/rickastley.js'></script>
</body>
Not only was this tedious, but it was also error-prone. There were the obvious issues like typos or forgetting to include a file, but more than that, the order of the <script> tags mattered. If you loaded a script that depended on React before loading the React script, things would break. Because webpack (intelligently) creates a bundle for you, both of those problems go away. You don’t have to worry about forgetting a <script> and you don’t have to worry about the order.

<body>

  ...

  <script src='dist/bundle.js'></script>
</body>
As we’ll soon see, the “module bundling” aspect is just one part of webpack. If needed, you’re also able to tell webpack to make certain transformations on your modules before adding them to the bundle. Examples might include transforming SASS/LESS to regular CSS or “modern JavaScript” to ES5 that the browser can understand.

Installing webpack
Assuming you’ve initialized a new project with npm, there are two packages you need to install to use webpack, webpack and webpack-cli.

npm install webpack webpack-cli --save-dev
webpack.config.js
Once you’ve installed webpack and webpack-cli, it’s time to start configuring webpack. To do that, you’ll create a webpack.config.js file that exports an object. Naturally, this object is where all the configuration settings for webpack will go.

// webpack.config.js
module.exports = {}
Remember, the whole point of webpack is to “examine all of your modules, (optionally) transform them, then intelligently put all of them together into one or more bundle(s)” If you think about that process, in order to do that, webpack needs to know three things.

The entry point of your application
Which transformations, if any, to make on your code
The location to put the newly formed bundle(s)
The entry point
Whenever your application is composed of modules, there’s always a single module that is the entry point of your application. It’s the module that kicks everything off. Typically, it’s an index.js file. Something like this.

index.js
  imports about.js
  imports dashboard.js
    imports graph.js
    imports auth.js
      imports api.js
If we give webpack the path to this entry file, it’ll use that to create the dependency graph of our application (much like we did above, except… better). To do that, you add an entry property to your webpack config which points to your entry file.

// webpack.config.js

module.exports = {
  entry: './app/index.js'
}
Transformations with Loaders
Now that webpack knows the entry file, the next thing we need to tell it is what transformations to run on our code. To do this, we’ll use what are called “loaders”.

Out of the box, when webpack is building its dependency graph by examining all of your import/require() statements, it’s only able to process JavaScript and JSON files.

import auth from './api/auth' // 👍
import config from './utils/config.json' // 👍
import './styles.css' // ⁉️
import logo from './assets/logo.svg' // ⁉️
There’s a very good chance that you’re going to want your dependency tree to be made up of more than just JS and JSON files - i.e., you’re going to want to be able to import .css files, .svg files, images, etc, as we’re doing above. This is where “loaders” can help us out. The primary purpose of a loader, as the name suggests, is to give webpack the ability to process more than just JavaScript and JSON files.

The first step to adding any loader is to download it. Because we want to add the ability to import .svg files in our app, we’ll download the svg-inline-loader from npm.

npm install svg-inline-loader --save-dev
Next, we need to add it to our webpack config. All of the information for your loaders will go into an array of objects under module.rules.

// webpack.config.js

module.exports = {
  entry: './app/index.js',
  module: {
    rules: []
  }
}
Now there are two pieces of information we need to give webpack about each loader. First, the type of file we want to run the loader on (in our case, all .svg files). Second, the loader to use on that file type (in our case, svg-inline-loader).

To do this, we’ll have an object with two properties, test and use. test will be a regex to match the file path and use will be the name of the loader we want to use.

// webpack.config.js

module.exports = {
  entry: './app/index.js',
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' }
    ]
  }
}
Now anywhere in our app, we’ll be able to import .svg files. What about our .css files though? Let’s add a loader for that as well. We’ll use the css-loader.

npm install css-loader --save-dev
// webpack.config.js

module.exports = {
  entry: './app/index.js',
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' },
      { test: /\.css$/, use: 'css-loader' }
    ]
  }
}
Now anywhere in our app, we can import .svg and .css files. However, there’s still one more loader we need to add to get our styles to work properly. Right now, because of our css-loader, we’re able to import .css files. However, that doesn’t mean those styles are being injected into the DOM. What we really want to do is import a CSS file then have webpack put all of that CSS in a <style> tag in the DOM so they’re active on the page. To do that, we’ll use the style-loader.

npm install style-loader --save-dev
// webpack.config.js

module.exports = {
  entry: './app/index.js',
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] }
    ]
  }
}
Notice, because we now have two loaders for our .css rule, we change use to be an array. Also, notice that we have style-loader before css-loader. This is important. Webpack will process those in reverse order. So css-loader will interpret the import './styles.css' line then style-loader will inject that CSS into the DOM.

As we just saw with style-loader, loaders can do more than just allow you to import certain file types. They’re also able to run transformations on files before they get added to the final output bundle. The most popular is transforming “next generation JavaScript” to the JavaScript of today that browsers can understand using Babel. To do this, you can use the babel-loader on every .js file.

npm install babel-loader --save-dev
// webpack.config.js

module.exports = {
  entry: './app/index.js',
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
      { test: /\.(js)$/, use: 'babel-loader' }
    ]
  }
}
There are loaders for just about anything you’d need to do. You can check out the full list here.

The output
Now that webpack knows the entry file and what loaders to use, the next thing we need to tell it is where to put the bundle it creates. To do this, you add an output property to your webpack config.

// webpack.config.js

const path = require('path')

module.exports = {
  entry: './app/index.js',
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
      { test: /\.(js)$/, use: 'babel-loader' }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  }
}
So the full process looks something like this.

webpack grabs the entry point located at ./app/index.js.
It examines all of our import and require statements and creates a dependency graph.
webpack starts creating a bundle, whenever it comes across a path we have a loader for, it transforms the code according to that loader then adds it to the bundle.
It takes the final bundle and outputs it at dist/index_bundle.js.
Plugins
We’ve seen how you can use loaders to work on individual files before or while the bundle is being generated. Unlike loaders, plugins allow you to execute certain tasks after the bundle has been created. Because of this, these tasks can be on the bundle itself, or just to your codebase. You can think of plugins as a more powerful, less restrictive version of loaders.

Let’s take a look at a few examples.

HtmlWebpackPlugin
Earlier we saw that the main benefit of webpack was that it would generate a single bundle for us that we could then use to reference inside of our main index.html page.

What HtmlWebpackPlugin does is it will generate this index.html page for us, stick it inside of the same directory where our bundle is put, and automatically include a <script> tag which references the newly generated bundle.

So in our example, because we’ve told webpack to name the final bundle index_bundle.js and put it in a folder called dist, when HtmlWebpackPlugin runs, it’ll create a new index.html file, put it in dist, and include a script to reference the bundle, <script src='index_bundle.js'></script>. Pretty nice, right? Because this file is being generated for us by HtmlWebpackPlugin, even if we change the output path or file name of our bundle, HtmlWebpackPlugin will have that information and it’ll adapt accordingly.

Now, how we do adjust our webpack config in order to utilize HtmlWebpackPlugin? As always, we first need to download it.

npm install html-webpack-plugin --save-dev
Next, we add a plugins property which is an array to our webpack config.

// webpack.config.js

const path = require('path')

module.exports = {
  entry: './app/index.js',
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
      { test: /\.(js)$/, use: 'babel-loader' }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  plugins: []
}
Then in order to use HtmlWebpackPlugin, we create a new instance of it inside of our plugins array.

// webpack.config.js

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './app/index.js',
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
      { test: /\.(js)$/, use: 'babel-loader' }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
EnvironmentPlugin
If you’re using React, you’ll want to set process.env.NODE_ENV to production before you deploy your code. This tells React to build in production mode which will strip out any developer features like warnings. Webpack makes this simple by providing a plugin called EnvironmentPlugin. It comes as part of the webpack namespace so you don’t need to download it.

// webpack.config.js

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: './app/index.js',
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
      { test: /\.(js)$/, use: 'babel-loader' }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      'NODE_ENV': 'production'
    })
  ]
}
Now, anywhere in our application, we’ll be able to tell if we’re running in production mode by using process.env.NODE_ENV.

HtmlWebpackPlugin and EnvironmentPlugin are just a small taste of what you can do with webpack’s plugin system. Here’s a full list of officially supported plugins.

Mode
Whenever you build your app for production, there are a few steps you want to take. We just learned about one of them which was setting process.env.NODE_ENV to production. Another would be minifying your code and stripping out comments to reduce the bundle size.

Utilizing plugins for each one of these production tasks would work, but there’s a much easier way. In your webpack config, you can set the mode property to development or production depending on which environment you’re in.

// webpack.config.js

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './app/index.js',
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
      { test: /\.(js)$/, use: 'babel-loader' }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  mode: 'production'
}
Notice we were able to get rid of our EnvironmentPlugin. The reason for that is by setting mode to production, webpack will automatically set process.env.NODE_ENV to production. It will also minify our code and strip out warnings.

Running webpack
At this point, we have a pretty solid grasp on how webpack works and how to configure it, the only other thing we need to do now is actually run it.

Assuming you’re using npm and have a package.json file, you can create a script to execute webpack.

// package.json

"scripts": {
  "build": "webpack"
}
Now whenever you run npm run build from the command line, webpack will execute and create an optimized bundle named index_bundle.js and put it inside of the dist directory.

Production vs Development Modes
At this point, there’s nothing more about webpack itself that we’re going to cover. However, it is important that you understand how to easily switch between running in development mode and running in production mode.

As we talked about, when we’re building for production, we want everything to be as optimized as possible. When we’re building for development, the opposite is true.

To make it easy to switch between production and development builds, we’ll have two different commands we can run via our npm scripts.

npm run build will build our app for production.

npm run start will start a development server which will automatically regenerate our bundle whenever we make a change to our code.

If you’ll remember, we hardcoded mode to production inside of our webpack config. However, we only want to run in production mode when we run npm run build. If we run npm run start, we want mode set to development. To fix this, let’s adjust our scripts.build property in our package.json file to pass along an environment variable.

"scripts": {
  "build": "NODE_ENV='production' webpack",
}
If you’re on Windows, the command is a bit different: "SET NODE_ENV='production' && webpack"

Now, inside of our webpack config, we can toggle mode based on process.env.NODE_ENV.

// webpack.config.js

...

  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}
Now whenever we want to build our app for production, we just run npm run build in our command line. That will generate an index.html file and an index_bundle.js file and put them in the dist directory.

webpack DevServer
Unlike building for production, when we’re developing, it’s all about speed. We don’t want to have to re-run webpack and wait for it to rebuild the dist directory every time we change our code. This is where the webpack-dev-server package can help us out.

As the name implies, webpack-dev-server is a development server for webpack. Instead of generating a dist directory, it’ll keep track of your files in memory and serve them via a local server. More than that, it supports live reloading. What that means is whenever you make a change in your code, webpack-dev-server will quickly recompile your code and reload the browser with those changes.

As always, to use it we first need to install it.

npm install webpack-dev-server --save-dev
Then all we need to do is update our start script to run webpack-dev-server.

"scripts": {
  "build": "NODE_ENV='production' webpack",
  "start": "webpack-dev-server"
}
Just like that, we have two commands, one for creating a development server and one for building our app for production.
