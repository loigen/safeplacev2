const path = require('path');

module.exports = {
  entry: './src/index.js', // Your entry point
  output: {
    filename: 'bundle.js', // Your output bundle file
    path: path.resolve(__dirname, 'dist') // Your output directory
  },
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "util": require.resolve("util/"),
      "zlib": require.resolve("browserify-zlib"),
      "stream": require.resolve("stream-browserify"),
      "url": require.resolve("url/"),
      "assert": require.resolve("assert/")
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Rule for JavaScript/JSX files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Transpile with Babel
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/, // Rule for CSS files
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'), // Directory for the dev server to serve
    compress: true, // Enable gzip compression
    port: 9000 // Port for the dev server
  }
};
