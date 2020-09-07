<template>
    <div class="itemlist">
        <div class="itemimg" @click="todetai(itemobj)">
            <img :src="itemobj.doorPhoto">
        </div>
        <div class="itemright">
            <div class="itemtitle" @click="todetai(itemobj)">
                <div class="itemtitleval">{{itemobj.name}}</div>
                <img v-if="itemobj.top" src="../assets/image/home/dianzan.png">
            </div>
            <div class="zhekoubox">
                <div class="zhekou" v-if="itemobj.discount">商品低至{{itemobj.discount}}折</div>
                <div class="zhekou" v-if="itemobj.manjian" v-for="item in itemobj.manjian">满{{item.full}}减{{item.subtract}}</div>
                <div class="zhekou" v-if="itemobj.youli">{{itemobj.youli.content}}</div>
            </div>
            <div class="adress">
                <div class="adressval">{{itemobj.address}}</div>
                <div class="adressicon">
                    <img class="daohangimg" src="../assets/image/home/adress.png">
                    <div @click="daohangfn(itemobj)">导航</div>
                </div>
            </div>
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
            itemobj:{}
        },
        methods:{
            daohangfn(item){
                window.location.href = 'http://uri.amap.com/marker?position='+item.latitude+','+item.longitude+'&name='+item.name+'&coordinate=gaode&callnative=1'
            },
            todetai(item){
                console.log(item)
                this.$router.push({path:'/shopDetail',query:{id:item.id}})
            },
        },
        mounted(){
        },
        created() {
        },
    }
</script>

<style scoped lang="less">
    .itemlist{
        width: 100%;
        display: flex;
        flex-direction: row;
    }
    .itemimg{
        width: 72px;
        height: 72px;
        font-size: 0px;
        overflow: hidden;
    }
    .itemimg>img{
        width: 100%;
    }
    .itemright{
        flex: 1;
        width: 200px;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 10px;
        border-bottom: 1px solid #E5E5E5;
    }
    .itemtitle{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .itemtitleval{
        font-weight: bold;
        margin-right: 10px;
        font-size: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        text-align: left;
    }
    .zhekoubox{
        width: 100%;
        display: flex;
    }
    .zhekou{
        width: 100px;
        height: 22px;
        margin-right: 10px;
        text-align: center;
        line-height: 22px;
        background-color: #FFF7F0;
        color: #F18B36;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .adress{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .adressval{
        width: 150px;
        flex: 1;
        color: #C1C1C1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 15px;
        text-align: left;
    }
    .adressicon{
        display: flex;
    }
    .daohangimg{
        height: 20px;
        margin-right: 5px;
    }
</style>
