require('./index.scss');

new view({
  el: '#animate',
  template: require('./index.html'),
  data: {
    text: 'start'
  },
  mounted() {
    /* var curIndex = 0;
    var timer = setInterval(() => {
      curIndex++;
      switch (curIndex) {
        case 1:
          this.text = 'three';
          this.$repaint();
          break;
        case 2:
          this.text = 'two';
          this.$repaint();
          break;
        case 3:
          this.text = 'one';
          this.$repaint();
          break;
      }
      if (curIndex > 3) {
        clearInterval(timer);
      }
    }, 2000) */
    var oH1 = document.querySelector('.animate>h1'),
      nowIndex = 0;
    console.log(oH1)
    var timer = setInterval(function () {
      nowIndex++;
      switch (nowIndex) {
        case 1:
          oH1.innerHTML = 'three';
          break;
        case 2:
          oH1.innerHTML = 'two';
          break;
        case 3:
          oH1.innerHTML = 'one';
          break;
        case 4:
          oH1.innerHTML = 'go';
          break;
      }
      if (nowIndex > 4) {
        setTimeout(() => {
          clearInterval(timer);
        }, 2000)
      }
    }, 2000)
  }
})