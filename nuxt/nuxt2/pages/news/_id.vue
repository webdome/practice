<template>
  <div>
    news detail
    <p>{{id}}</p>
    异步数据长度 {{cityList.length}}
  </div>
</template>
<script>
import api from '../../static/js/api.js'
export default {
  /* 
    // 校验动态路由参数的有效性
    validate ({ params }) {
      return /^\d+$/.test(params.id)
    }, 
  */

  /* async asyncData ({ params }) {
    let { data } = await api.getAreas(params)
    return { cityList: data }
  }, */

  /* async fetch ({ store, params }) {
    let { data } = await axios.get('http://my-api/stars')
    store.commit('setStars', data)
  }, */

  /* head () {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  }, */

  /* layout (context) {
    return 'blog'
  }, */

  /*  
    // 页面级  中间件
    middleware: 'authenticated'
  */

  /*  
    // 进入页面滚动到顶部
    scrollToTop: true
  */

  /* 
    // 页面过渡效果
    // 可以是字符
    transition: ''
    // 或对象
    transition: {}
    // 或函数
    transition (to, from) {}
  */

  

  data(){
    return {
      title: 'news detail',
      id: this.$route.params.id,
      cityList: []
    }
  },
  /* methods: {
    async asyncData(){
      let { data } = await api.getAreas(this.$route.params)
      return this.cityList = data;
    }
  },
  mounted(){
    this.asyncData();
  } */
}
</script>

