<template>
    <div>
        <div>{{name+' and jerry'}}</div>
        <div v-bind:title="name" :data-id="age">v-bind</div>
        <div v-show="show">v-show</div>
        <div v-if="ifs" class="abs">v-if</div>
        <button @click="log">v-on</button>
        <p id="seat">seat</p>
    </div>
</template>
<script>
export default {
  data() {
    return {
      name: "tom",
      age: 18,
      show: true,
      ifs: true
    };
  },
  methods:{
    log(){
      console.log(1);
    }
  }
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
div {
  font-size: 16px;
  color: #333;
}
</style>
