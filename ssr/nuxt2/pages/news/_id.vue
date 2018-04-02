<template>
  <div>
    news detail {{title}}
  </div>
</template>
<script>
export default {
  validate ({ params }) {
    return /^\d+$/.test(params.id)
  },
  data(){
    return{
      id: this.$route.params.id
    }
  },
  methods: {

  }
}
</script>
