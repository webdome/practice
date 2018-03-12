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
  /* validate ({ params }) {
    return /^\d+$/.test(params.id)
  }, */

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

