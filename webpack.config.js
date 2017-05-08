module.exports = {
  entry: './src/gol.js',

  output: {
    filename: './build/gol.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/, 
        loader: "babel-loader", 
        exclude: /node_modules/,
        options: {
          presets: ['es2015']
        }
      }
    ]
  }
};
