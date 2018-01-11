<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <!-- <app-hello /> -->
    <hello></hello>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Hello from  '../../components/Hello/appHello.vue'
  export default {
    name: 'HelloWorld',
    data () {
      return {
      }
    },
    components:{
      Hello
    },
    computed: {
      ...mapGetters([
        'msg'
      ])
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
