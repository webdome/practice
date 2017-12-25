new view({
  el: '#count',
  template: require('./count.html'),
  data: {
    count: ''
  },
  mounted() {
    microkid.mediator.on("appReady", (time)=> {
      this.count = `app is ready in time ${new Date().getTime()-time}ms`;
      this.$repaint();
      // microkid.mediator.off('appReady')
    })
  }
})