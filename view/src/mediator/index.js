require('./count')

new view({
  el: '#app',
  template: require('./index.html'),
  data: {
    list: [1, 2, 3, 4, 5]
  },
  mounted() {
    microkid.mediator.publish("appReady",new Date().getTime());
  }
})