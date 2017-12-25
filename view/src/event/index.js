require('./index.scss')
new view({
    el: '#event',
    template: require('./index.html'),
    data:{
        text: 'hello world',
        tel: '13721083318'
    },
    events: {
        'click #get'($this,event){
            console.log(`text= ${this.text}`);
            console.log(`tel= ${this.tel}`);
        }
    }
})