<template>
    <div class="container" style="margin-top: 0px;overflow: auto">
        <div class="topinfo">
            <div class="topcont">
                <div class="detaiimg">
                    <img :src="dataobj.doorPhoto">
                </div>
                <div class="topcenter">
                    <div class="shoptitle">{{dataobj.name}}</div>
                    <div>人均消费：{{dataobj.averageCost}}元</div>
                </div>
                <div class="topright" v-if="false">
                    <div>4.5分</div>
                    <div>评分</div>
                </div>
            </div>
            <div class="top_under">
                <div class="top_underitem">
                    <div class="u_itemname">折扣活动：</div>
                    <div class="u_iteval">
                        <div class="u_itemvalbtn">{{dataobj.discount}}</div>
                    </div>
                </div>
                <div class="top_underitem">
                    <div class="u_itemname">满减优惠：</div>
                    <div class="u_iteval">
                        <div class="u_itemvalbtn2" v-for="item in dataobj.manjian">满{{item.full}}减{{item.subtract}}</div>
                    </div>
                </div>
                <div class="top_underitem">
                    <div class="u_itemname">有礼：</div>
                    <div class="u_iteval">
                        <div class="u_itemvalbtn" v-if="dataobj.youli">{{dataobj.youli.content}}</div>
                    </div>
                </div>
                <div class="adresscont">
                    <div class="adressleft">
                        <span class="adressicon iconfont icon-dingwei"></span>
                        <span>{{dataobj.address}}</span>
                    </div>
                    <div class="adressright">
                        <span class="adressrifht_icon iconfont icon-daohang"></span>
                        <span>导航</span>
                    </div>
                </div>
                <div class="adresscont">
                    <div class="adressleft">
                        <span class="adressicon iconfont icon-shijian"></span>
                        <span><span style="margin-right: 10px">{{dataobj.businessHours}}</span><span>联系电话:{{dataobj.phone}}</span></span>
                    </div>
                    <div class="adressright" @click="calltel">
                        <span class="adressrifht_icon iconfont icon-dianhua"></span>
                        <span>拨号</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="fenge"></div>
        <div class="detai_info">
            <div class="detailnav">
                <div :class="item.active?'detainavitem2':'detainavitem'" v-for="item in navarr" @click="navfn(item)">{{item.val}}</div>
            </div>
            <div class="tishibox">
                <span style="color: rgb(241,139,54)">温馨提示:</span>
                <span>此页面信息由商家提供，消费者到店消费时，注意核实，理性消费，商家如有违法违规行为欢迎投诉举报。</span>
            </div>
            <div class="goodscont" v-if="navtype==0">
                <div class="goodslistbox" v-for="item in goodsarr">
                    <div class="goodsimg">
                        <img :src="item.img">
                    </div>
                    <div class="goodsright">
                        <div class="goodstitle">{{item.describe}}</div>
                        <div class="goodsprice">
                            <span class="moneyicon iconfont icon-qian"></span>
                            <span>价格:</span>
                            <span style="color: rgb(241,139,54);margin-left: 10px">{{item.price}}</span>
                            <span>元</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="shopcont" v-if="navtype==1">
                <div class="shoptitle2">商户介绍</div>
                <div class="shopval">{{dataobj.introduction}}</div>
                <div class="shopimg">
                    <div class="shopimgitem" v-for="(item,index) in photoarr" :key="index" :style="index%3==0?'margin-left:0':'margin-left:5%'">
                        <img :src="imgapi+item.src">
                    </div>
                </div>
            </div>
        </div>
        <div class="tousubox" v-if="navtype==1">
            <div class="tousutel">
                <div class="tousuleft">
                    <span style="font-weight: bold;margin-right: 10px">消费者投诉热线:</span>
                    <span style="color: #BE2929">12315</span>
                </div>
                <div style="color: #BE2929" class="tousuright iconfont icon-jinggao" @click="showtousu = !showtousu"></div>
            </div>
            <div class="tousubtn" v-if="showtousu">
                <div class="toususelect">
                    <a-select style="width: 100%" v-model="selectval">
                        <a-select-option value="1">1</a-select-option>
                        <a-select-option value="2">2</a-select-option>
                    </a-select>
                </div>
                <div class="sunbbtn" @click="subfn">提交</div>
            </div>
        </div>
    </div>
</template>

<script>
    import http from '../../utils/http'
    import {Select} from 'ant-design-vue'
    export default {
        components: {
            ASelect:Select,
            ASelectOption:Select.Option
        },
        name: "shopdetail",
        data() {
            return {
                navarr:[
                    {val:'商品',id:0,active:true},
                    {val:'商家',id:1,active:false},
                ],
                navtype:0,
                selectval:1,
                detaiid:-1,
                dataobj:{},
                goodsarr:[],
                photoarr:[],
                showtousu:false,
            }
        },
        props: {},
        methods: {
            subfn(){
                let _this = this
                http.post('/api/reportRecord/insert',{userId:1,otherCategoryId:this.selectval,merchantId:this.detaiid}).then(res => {
                    if (res.code == 0) {
                        _this.$router.push({path:'/shop'})
                    } else {
                    }
                })
            },
            calltel(){
                window.location.href='tel:'+dataobj.phone;
            },
            navfn(item){
                for(let i = 0;i<this.navarr.length;i++){
                    this.navarr[i].active = false
                }
                this.navtype = item.id
                item.active = true
            },
            getpic(){
                let _this = this
                http.post('/api/photo/list',{id:this.dataobj.ambientPhoto}).then(res => {
                    if (res.code == 0) {
                        console.log(res)
                        _this.photoarr = res.data
                    } else {
                    }
                })
            },
            getdata(){
                let _this = this
                http.post('/api/merchant/get',{id:this.detaiid}).then(res => {
                    if (res.code == 0) {
                        console.log(res)
                        res.data['manjian'] = JSON.parse(res.data.reduce)
                        res.data['youli'] = JSON.parse(res.data.gift)
                        _this.dataobj = res.data
                        console.log(_this.dataobj)
                        _this.getpic()
                    } else {
                    }
                })
            },
            addhot(){
                let _this = this
                http.post('/api/merchant/popularity',{id:this.detaiid}).then(res => {
                    if (res.code == 0) {
                    } else {
                    }
                })
            },
            getgoods(){
                let _this = this
                http.post('/api/commodity/index',{merchantId:this.detaiid}).then(res => {
                    if (res.code == 0) {
                        console.log(res)
                        _this.goodsarr = res.data
                    } else {
                    }
                })
            },
        },
        mounted() {
        },
        created() {
            if(this.$route.query.id){
                this.detaiid = this.$route.query.id
                this.getdata()
                this.getgoods()
                this.addhot()
            }
        },
    }
</script>
<style>
    .topinfo{
        width: 100%;
        padding: 10px 20px;
        box-sizing: border-box;
    }
    .topcont{
        width: 100%;
        border-bottom: 1px solid #ccc;
        padding-bottom: 15px;
        display: flex;
    }
    .detaiimg{
        width: 72px;
        height: 72px;
        overflow: hidden;
    }
    .detaiimg>img{
        width: 100%;
    }
    .topcenter{
        width: 100px;
        flex: 1;
        margin: 0 10px;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    .shoptitle{
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: bold;
    }
    .topright{
        width: 70px;
        text-align: center;
        border-left: 1px solid #ccc;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-weight: bold;
    }
    .top_under{
        width: 100%;
        padding: 10px 0;
    }
    .top_underitem{
        width: 100%;
        display: flex;
        margin-bottom: 10px;
    }
    .u_itemname{
        font-weight: bold;
        line-height: 20px;
        margin-right: 10px;
        width: 70px;
        text-align: right;
    }
    .u_iteval{
        flex: 1;
        width: 100px;
        display: flex;
        flex-wrap: wrap;
    }
    .u_itemvalbtn,.u_itemvalbtn2{
        padding: 0 5px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        background-color: rgb(255,236,221);
        color: rgb(241,139,54);
        font-size: 13px;
        margin-bottom: 10px;
        margin-right: 5px;
    }
    .u_itemvalbtn2{
        background-color: #fff;
        border: 1px solid rgb(255,236,221);
    }
    .adresscont{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 13px;
        margin-bottom: 10px;
    }
    .adressleft{
        width: 100px;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 10px;
    }
    .adressicon{
        margin-right: 10px;
    }
    .adressright{
        height: 25px;
        line-height: 25px;
        padding: 0 10px;
        border: 1px solid rgb(241,139,54);
        color: rgb(241,139,54);
        display: flex;
        justify-content: center;
        border-radius: 5px;
    }
    .adressrifht_icon{
        margin-right: 10px;
    }
    .fenge{
        height: 15px;
        width: 100%;
        background-color: rgb(241,252,255);
    }
    .detai_info{
        width: 100%;
        padding: 0 20px 30px;
        box-sizing: border-box;
    }
    .detailnav{
        padding: 10px 0;
        display: flex;
    }
    .detainavitem,.detainavitem2{
        padding: 7px 18px;
        box-sizing: border-box;
        border-radius: 7px;
        border: 1px solid black;
        color: black;
        margin-right: 20px;
    }
    .detainavitem2{
        border: 1px solid rgb(241,139,54);
        background-color: rgb(241,139,54);
        color: white;
    }
    .tishibox{
        background-color: rgb(248,246,249);
        padding: 10px;
        box-sizing: border-box;
        line-height: 25px;
    }
    .goodscont{
        width: 100%;
        margin-top: 10px;
    }
    .goodslistbox{
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
    }
    .goodsimg{
        width: 80px;
        height: 80px;
        overflow: hidden;
        font-size: 0px;
        border-radius: 5px;
    }
    .goodsimg>img{
        width: 100%;
    }
    .goodsright{
        width: 200px;
        flex: 1;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .goodsprice{
        font-size: 15px;
        font-weight: bold;
        text-align: right;
    }
    .moneyicon{
        font-size: 16px;
        margin-right: 5px;
        position: relative;
        top: 1px;
    }
    .shopcont{
        width: 100%;
        margin-top: 10px;
    }
    .shoptitle2{
        font-weight: bold;
        font-size: 18px;
    }
    .shopimg{
        width: 100%;
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .shopimgitem{
        width: 30%;
        font-size: 0px;
        margin-left: 5%;
        margin-bottom: 10px;
        height: 80px;
        overflow: hidden;
    }
    .shopimgitem>img{
        width: 100%;
    }
    .tousubox{
        width: 100%;
        background-color: rgb(241,252,255);
        padding: 10px 20px;
        padding-top: 50px;
        box-sizing: border-box;
    }
    .tousutel{
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        border-bottom: 1px solid #ccc;
    }
    .tousubtn{
        margin-top: 30px;
        margin-bottom: 100px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .toususelect{
        flex: 1;
        margin-right: 15px;
    }
    .sunbbtn{
        width: 100px;
        text-align: center;
        padding: 4px 0;
        background-color: rgb(241,139,54);
        color: white;
        border-radius: 5px;
    }
</style>
