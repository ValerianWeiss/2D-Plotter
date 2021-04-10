module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['serialport']
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
