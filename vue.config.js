module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = "Trang quản trị | Hệ thống air shop";
        return args;
      })
  }
}