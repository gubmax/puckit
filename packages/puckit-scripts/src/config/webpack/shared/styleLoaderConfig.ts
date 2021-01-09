const styleLoaderOptions = {
  test: /(\.module)?\.(s?css|sass)$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: {
          mode: 'local',
          localIdentName: '[name]__[local]--[hash:base64:5]',
        },
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
}

export default styleLoaderOptions
