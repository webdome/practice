require('./index.scss');

new view({
  el: '#app',
  template: require('./index.html'),
  data: {
    say: 'hello',
    name: 'model',
    list: []
  },
  events: {
    'click #changebtn'(e) {
      this.changeName();
    }
  },
  methods: {
    changeName() {
      this.name = "newModel is show";
      this.$repaint();
    },
    getList() {
      var list = require('../../libs/list.json')
      this.list = list.content;
      this.$repaint();
      // this.$get('./libs/list.json').then((res) => {
      //   if (res.code == 0) {
      //     this.list = res.content;
      //   }
      //   this.$repaint();
      // }).catch((err) => {

      // });
    }
  },
  // 实例已创建并且初始化 DOM还未生成
  created() {
    console.log('view 实例化完成');
  },
  // DOM已生成
  mounted() {
    console.log('DOM 挂载完成');
    this.getList();
  },
  // DOM更新
  updated() {
    console.log('DOM 更新完成');
  }
});