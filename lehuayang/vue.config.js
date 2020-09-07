module.exports = {
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#1890ff',
          'link-color': '#1890ff',
          'border-radius-base': '6px',
        },
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    disableHostCheck: true,
    open: true,
    host: '0.0.0.0',
    port: 3020,
    https: false,
    hotOnly: false,
    proxy: {//配置跨域
      '/api': {
        target: 'https://www.mysterycode.cn/api',
        ws: true,
        changOrigin: true,//允许跨域
        pathRewrite: {
          '^/api': ''//请求的时候使用这个api就可以
        }
      }
    }
  }
}

