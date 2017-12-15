new view({
  el: '#count',
  template: require('./count.html'),
  data: {
    count: 0
  },
  mounted() {
    microkid.mediator.subscribe("appReady", function (time) {
      console.log(`app is ready in time ${time}`)
      // microkid.mediator.remove('appReady')
    })
  }
})