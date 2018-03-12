module.exports = {
  build: {
    vendor: ['axios'],
    // plugins: [
    //   new webpack.ProvidePlugin({
    //     '$': 'jquery',
    //     '_': 'lodash'
    //   })
    // ]
  },
  // 全局
  router: {
    middleware: 'authenticated'
  },
  loading: {
    color: 'blue',
    height: '2px'
  }
  // loading: './components/loading.vue'
}