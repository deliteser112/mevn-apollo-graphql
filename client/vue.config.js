const config = {
  configureWebpack: {
    resolve: {
      // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
      extensions: ['*', '.mjs', '.js', '.ts', '.vue', '.json', '.gql', '.graphql'],
    },
    module: {
      rules: [ // fixes https://github.com/graphql/graphql-js/issues/1272
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        {
          test: /\.svg$/,
          use: ['babel-loader', 'vue-svg-loader'],
        }
      ],
    },
  },
};

module.exports = config;
