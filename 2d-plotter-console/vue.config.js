module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/main.sass";`
      }
    }
  }
};
