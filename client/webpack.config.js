const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // config.resolve.alias['react'] = 'node_modules/react';
  // config.resolve.alias['react-dom'] = 'node_modules/react-dom';

  // Add new rules to the oneOf containing all previously defined rules
  // Overwrite options due to lack of webpack 5 support
  config.module.rules[1].oneOf.unshift({
    test: /\.svg$/,
    exclude: /node_modules/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          presets: ['@svgr/webpack'],
          svgoConfig: {
            plugins: [
              {
                name: 'removeViewBox',
                active: false,
              },
              {
                name: 'removeUnknownsAndDefaults',
                active: false,
              },
              {
                name: 'convertColors',
                active: false,
              },
              {
                name: 'inlineStyles',
                params: {
                  onlyMatchedOnce: false,
                },
              },
            ],
          },
        },
      },
    ],
  });
  return config;
};
