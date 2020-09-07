<template>
    <div class="container" style="padding-top: 10px;background-color: #fff;"
         ref="contentref"
         @touchstart="touchStart($event)"
         @touchmove="touchMove($event)"
         @touchend="touchEnd($event)">
        <div class="serchcont">
            <input type="text" v-model="keyval" placeholder="商户搜索" />
            <div class="serchimg" @click="serchfn">
                <img src="../../assets/image/shop/serch.png">
            </div>
        </div>
        <div class="navbox">
            <undernav :navunderarr="navunderarr" @undernavfn="undernavfn"></undernav>
        </div>
        <div class="orderbox">
            <div style="display: flex">
                <div :class="item.active?'orderitem2':'orderitem'" v-for="item in orderarr" @click="orderfn(item)">{{item.val}}</div>
            </div>
            <div class="resultbox">
                <span>结果数：</span>
                <span style="color: #F18B36">{{listarr.length}}</span>
            </div>
        </div>
        <div class="undercont">
            <div class="underitem">
                <div class="listcont">
                    <div class="listitem" v-for="item in listarr">
                        <goodslist :itemobj="item"></goodslist>
                    </div>
                </div>
                <div class="morebox" v-if="listarr.length>0">{{loadval}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    // import { Swiper,SwiperItem } from 'vux'
    import undernav from '../../components/undernav'
    import goodslist from '../../components/goodslist'
    import http from '../../utils/http'
    export default {
        components: {
            undernav,
            goodslist
        },
        name: "serchshop",
        data() {
            return {
                navunderarr:[
                    {name:'全部',id:0,active:true},
                ],
                listarr:[],
                keyval:"",
                orderarr:[
                    {val:"默认排序",type:'id',id:0,active:true},
                    {val:"折扣",type:'discount',id:1,active:false},
                    {val:"人气",type:'popularity',id:2,active:false},
                ],
                orderby:'id',
                shunxu:'asc',
                //上拉加载
                startY:0,
                endy:0,
                scrollTop:0,
                clientHeight:0,
                scrollHeight:0,
                isunder:false,
                loadval:'上拉加载~~',
                isserchtop:false,
                nowpage:1,//当前页数
                pagenum:12,
                allpage:1,
            }
        },
        props: {},
        methods: {
            touchStart(e){
                this.startY = e.changedTouches[0].pageY
            },//手势滑动开始
            touchMove(e){
                this.scrollTop = this.$refs.contentref.scrollTop
                this.clientHeight = this.$refs.contentref.clientHeight
                this.scrollHeight = this.$refs.contentref.scrollHeight
                if(this.scrollHeight-this.scrollTop-this.clientHeight<10){
                    this.isunder = true
                }else {
                    this.isunder = false
                }
            },//手势滑动移动
            touchEnd(e){
                this.endy = e.changedTouches[0].pageY
                if(this.endy<this.startY&&this.isunder){
                    this.nowpage +=1
                    this.getlist(true)
                }
            },//手势滑动结束

            orderfn(item){
                for(let i = 0;i<this.orderarr.length;i++){
                    if(item.id!=this.orderarr[i].id){
                        this.orderarr[i].active =false
                    }
                }
                item.active = !item.active
                this.orderby = item.type
                if(!item.active){
                    this.shunxu = 'desc'
                }else {
                    this.shunxu = 'asc'
                }
                this.getlist(false)
            },
            serchfn(){
                this.getlist(false)
            },
            undernavfn(item){
                for(let i = 0;i<this.navunderarr.length;i++){
                    this.navunderarr[i].active = false
                }
                this.nowtypeid = item.id
                item.active = true
                this.getlist()
            },
            getlist(type){
                let _this = this
                var data = {
                    pageNo:this.nowpage,
                    pageSize:this.pagenum,
                    categoryParentId:this.nowtypeid,
                    name:this.keyval,
                    orderField:this.orderby,
                    orderType:this.shunxu,
                }
                if(this.nowtypeid==0){
                    data = {
                        pageNo:this.nowpage,
                        pageSize:this.pagenum,
                        name:this.keyval,
                        orderField:this.orderby,
                        orderType:this.shunxu,
                    }
                }

                if(!type){
                    _this.listarr = []
                }
                http.post('/api/merchant/index',data).then(res => {
                    if (res.code == 0) {
                        for(let i = 0;i<res.data.length;i++){
                            res.data[i]['manjian'] = JSON.parse(res.data[i].reduce)
                            res.data[i]['youli'] = JSON.parse(res.data[i].gift)
                            _this.listarr.push(res.data[i])
                        }
                    } else {

                    }
                })
            },
            getnavfn(){
                let _this = this
                http.post('/api/category/index', {parentId:0}).then(res => {
                    if (res.code == 0) {
                        console.log(res)
                        _this.setnav(res.data)
                    } else {
                    }
                })
            },
            setnav(data){
                if(data.length>0){
                    for(let i = 0;i<data.length;i++){
                        data[i]['active'] =false
                        this.navunderarr.push(data[i])
                    }
                    this.undernavfn(this.navunderarr[0])
                }
            },
        },
        mounted() {
        },
        created() {
            this.getnavfn()
        },
    }
</script>
<style>
    .container{
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .serchcont{
        width: 90%;
        border: 1px solid #D2D2D2;
        margin: 0px auto;
        padding: 5px 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        border-radius: 5px;
        background-color: #fff;
    }
    .serchcont>input{
        border: none;
        outline: none;
        width: 200px;
        flex: 1;
        margin-right: 10px;
        text-indent: 5px;
    }
    .serchimg{
        width: 40px;
        border-left: 1px solid #ccc;
        padding-left: 10px;
    }
    .serchimg>img{
        width: 30px;
    }
    .undercont{
        width: 100%;
        text-align: center;
        margin-top: 20px;
        background-color: #F2FCFF;
        padding-bottom: 50px;
    }
    .underitem{
        width: 100%;
        margin-bottom: 10px;
        background-color: #fff;
        box-sizing: border-box;
        padding: 0 20px;
    }
    .listtitle{
        width: 100%;
        text-align: center;
        position: relative;
    }
    .listtitle>img{
        width: 30%;
    }
    .listtitleval{
        width: 100%;
        text-align: center;
        position: absolute;
        top: 0px;
    }
    .listcont{
        width: 100%;
        margin-top: 10px;
    }
    .listitem{
        width: 100%;
        display: flex;
        height: 82px;
        flex-direction: row;
        margin-top: 10px    ;
    }
    .navbox{
        width: 100%;
        box-shadow:0 5px 5px rgb(238,238,238);
        padding-bottom: 5px;
    }
    .orderbox{
        width: 100%;
        padding: 10px 20px;
        box-sizing: border-box;
        display: flex;
        margin-top: 10px;
        justify-content: space-between;
    }
    .orderitem,.orderitem2{
        margin-right: 15px;
    }
    .orderitem2{
        color: #F18B36;
    }
    .morebox{
        margin: 20px auto;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        color: rgb(150,150,150);
        background-color: #fff;
    }
</style>
