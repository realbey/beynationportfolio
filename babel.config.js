module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo automatically adds the Reanimated plugin when it is installed.
    presets: ['babel-preset-expo'],
  };
};
