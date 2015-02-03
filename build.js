({
  baseUrl: "./scripts",
  mainConfigFile: './scripts/common.js',
  dir: "./build",
  optimize: "uglify2",
  useStrict: true,

  // call with `node r.js -o build.js`
  // add `optimize=none` to skip script optimization (useful during debugging).
  // see https://github.com/requirejs/example-multipage/
  onBuildWrite: function (moduleName, path, singleContents) {
    return singleContents.replace(/jsx!/g, '');
  },

  optimizeCss: 'standard',
  stubModules: ['jsx'],

  modules: [
    {
      name: "common",
      exclude: ["react", "JSXTransformer", "text"]
    },
    {
      name: 'document',
      include: ['dispatchers/document'],
      exclude: ['common']
    }
  ]
})
