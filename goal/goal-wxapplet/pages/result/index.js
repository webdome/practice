//index.js
Page({
  data: {
    score: ''
  },
  onLoad(){
    this.setData({
      score: this.options.score
    })
  }
})
