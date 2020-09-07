<template>
  <div class="undernav">
    <div :class="item.active?'under_nav_item':'under_nav_item2'" v-for="item in navunderarr" @click="undernavfn(item)">{{item.name}}</div>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {

      }
    },
    props: {
      navunderarr:{}
    },
    methods:{
      undernavfn(item){
        this.$emit('undernavfn',item)
      },
    },
    mounted(){
    },
    created() {
    },
  }
</script>

<style scoped lang="less">
  .undernav{
    width: 100%;
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    white-space: nowrap;
    margin-top: 10px;
    padding: 0 10px;
  }
  .under_nav_item{
    color: #F18B36;
    padding: 10px 15px;
    border-bottom: 2px solid #F18B36;
  }
  .under_nav_item2{
    padding: 10px 15px;
  }
</style>
