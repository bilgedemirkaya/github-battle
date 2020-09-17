**Why does webpack exist?**


At its core, webpack is a module bundler. It examines all of the modules in your application, creates a dependency graph, then intelligently puts all of them together into one or more bundle(s) that your index.html file can reference.

App.js --->     |         |
Dashboard.js -> | Bundler | -> bundle.js
About.js --->   |         |
What problem is webpack solving?
Historically when building a JavaScript application, your JavaScript code would be separated by files (these files may or may not have been actual modules). Then in your index.html file, you’d have to include <script> tags to every JavaScript file you had.
```
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
```
Not only was this tedious, but it was also error-prone. There were the obvious issues like typos or forgetting to include a file, but more than that, the order of the <script> tags mattered. If you loaded a script that depended on React before loading the React script, things would break. Because webpack (intelligently) creates a bundle for you, both of those problems go away. You don’t have to worry about forgetting a <script> and you don’t have to worry about the order.
```
<body>

  ...

  <script src='dist/bundle.js'></script>
</body>
```
As we’ll soon see, the “module bundling” aspect is just one part of webpack. If needed, you’re also able to tell webpack to make certain transformations on your modules before adding them to the bundle. Examples might include transforming SASS/LESS to regular CSS or “modern JavaScript” to ES5 that the browser can understand.

**Installing webpack** 
Assuming you’ve initialized a new project with npm, there are two packages you need to install to use webpack, webpack and webpack-cli.

``` npm install webpack webpack-cli --save-dev ``` 

Once you’ve installed webpack and webpack-cli, it’s time to start configuring webpack. To do that, you’ll create a webpack.config.js file that exports an object. Naturally, this object is where all the configuration settings for webpack will go.


module.exports = {}
Remember, the whole point of webpack is to “examine all of your modules, (optionally) transform them, then intelligently put all of them together into one or more bundle(s)” If you think about that process, in order to do that, webpack needs to know three things.

**The entry point of your application** 

Which transformations, if any, to make on your code
The location to put the newly formed bundle(s)
The entry point
Whenever your application is composed of modules, there’s always a single module that is the entry point of your application. It’s the module that kicks everything off. Typically, it’s an index.js file. Something like this.
```
index.js
  imports about.js
  imports dashboard.js
    imports graph.js
    imports auth.js
      imports api.js
 ```
If we give webpack the path to this entry file, it’ll use that to create the dependency graph of our application (much like we did above, except… better). To do that, you add an entry property to your webpack config which points to your entry file.
```
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
```
There’s a very good chance that you’re going to want your dependency tree to be made up of more than just JS and JSON files - i.e., you’re going to want to be able to import .css files, .svg files, images, etc, as we’re doing above. This is where “loaders” can help us out. The primary purpose of a loader, as the name suggests, is to give webpack the ability to process more than just JavaScript and JSON files.

The first step to adding any loader is to download it. Because we want to add the ability to import .svg files in our app, we’ll download the svg-inline-loader from npm.

npm install svg-inline-loader --save-dev
Next, we need to add it to our webpack config. All of the information for your loaders will go into an array of objects under module.rules.
```
// webpack.config.js

module.exports = {
  entry: './app/index.js',
  module: {
    rules: []
  }
}
```
Now there are two pieces of information we need to give webpack about each loader. First, the type of file we want to run the loader on (in our case, all .svg files). Second, the loader to use on that file type (in our case, svg-inline-loader).

To do this, we’ll have an object with two properties, test and use. test will be a regex to match the file path and use will be the name of the loader we want to use.
```
// webpack.config.js

module.exports = {
  entry: './app/index.js',
  module: {
    rules: [
      { test: /\.svg$/, use: 'svg-inline-loader' }
    ]
  }
}
```
Now anywhere in our app, we’ll be able to import .svg files. What about our .css files though? Let’s add a loader for that as well. We’ll use the css-loader.
```
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
```
Now anywhere in our app, we can import .svg and .css files. However, there’s still one more loader we need to add to get our styles to work properly. Right now, because of our css-loader, we’re able to import .css files. However, that doesn’t mean those styles are being injected into the DOM. What we really want to do is import a CSS file then have webpack put all of that CSS in a <style> tag in the DOM so they’re active on the page. To do that, we’ll use the style-loader.
```
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
```
Notice, because we now have two loaders for our .css rule, we change use to be an array. Also, notice that we have style-loader before css-loader. This is important. Webpack will process those in reverse order. So css-loader will interpret the import './styles.css' line then style-loader will inject that CSS into the DOM.

As we just saw with style-loader, loaders can do more than just allow you to import certain file types. They’re also able to run transformations on files before they get added to the final output bundle. The most popular is transforming “next generation JavaScript” to the JavaScript of today that browsers can understand using Babel. To do this, you can use the babel-loader on every .js file.
```
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
```
