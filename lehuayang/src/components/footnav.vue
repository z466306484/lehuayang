<template>
  <div class="footnavbox">
    <div class="itemnav" v-for="item in footobj" :style="'color: '+item.color" @click="clickfoot(item)">
      <div :class="'navicon iconfont '+ item.icon"></div>
      <div class="navval">{{item.val}}</div>
    </div>

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
      footobj:{}
    },
    methods:{
      clickfoot(item){
        console.log(item)
        if(item.val=='商城'){
          this.$router.push({path:'/shop'})
        }else if(item.val=='首页'){
          this.$router.push({path:'/home'})
        }
      }
    },
    mounted(){
    },
    created() {
      console.log(this.footobj)
    },
  }
</script>

<style scoped lang="less">
  .footnavbox{
    width: 100%;
    height:50px;
    box-sizing: border-box;
    background-color: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow: hidden;
    .itemnav{
      width: 25%;
      text-align: center;
      .navicon{
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin: 0 auto;
        margin-top: 3px;
        font-size: 20px;
      }
      .navval{
        margin-top: 3px;
        width: 100%;
        height: 20px;
        text-align: center;
        line-height: 20px;
      }
    }
  }
</style>
