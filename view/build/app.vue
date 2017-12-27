<template>
    <div>
        <div :title="title">{{name}}</div>
        <div :title="title">{{name}}</div>
    </div>
</template>
<script>
export default {
  data(){
      return {
          name: 'div',
          title: 'i m div'
      }
  }
}
</script>
<style>
    div{
        font-size: 20px;
    }
</style>
