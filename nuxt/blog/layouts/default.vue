<template>
  <div>
    <ul class="mk-navs">
      <li v-for="(item,index) in navs" :key="index" :class="path===item.rname?'active':''">
        <nuxt-link :to="item.path">{{item.nname.toUpperCase()}}</nuxt-link>
      </li>
    </ul>
    <div class="mk-main">
      <nuxt/>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      navs: [{nname:'home',rname:'index',path:'/'},{nname:'code',rname:'code',path:'/code'}]
    }
  },
  computed: {
    path(){
      return this.$route.name
    }
  }
}
</script>

<style lang="scss">
.mk-navs{
  display: flex;
  flex-direction: row;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  li{
    border-bottom: 2px solid transparent;
    cursor: pointer;
    margin-right: 10px;
    a{
      display: block;
      padding: 0 5px;
    }
    &:hover,&.active{
      border-bottom: 2px solid #0088f5;
    }
  }
}

.mk-main{
  padding: 10px;
}
</style>
