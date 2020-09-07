<template>
    <div class="container" style="margin-top: 0px;"
         ref="contentref"
         @touchstart="touchStart($event)"
         @touchmove="touchMove($event)"
         @touchend="touchEnd($event)">
        <div class="bannerbox">
            <a-carousel arrows>
                <div
                        slot="prevArrow"
                        slot-scope="props"
                        class="custom-slick-arrow"
                        style="left: 10px;zIndex: 1;height: 140px;"
                >
                </div>
                <div v-for="item in bannerobj" @click="bannerclick(item)">
                    <img class="bgimg" :src="imgapi+item.src">
                </div>
            </a-carousel>
        </div>
        <div class="topnavcont">
            <div class="tonavbox">
                <div class="navitem">
                    <img src="../../assets/image/home/nav1.png" />
                    <div class="navval">领福利</div>
                </div>
                <div class="navitem">
                    <img src="../../assets/image/home/nav2.png" />
                    <div class="navval">逛华阳</div>
                </div>
                <div class="navitem">
                    <img src="../../assets/image/home/nav3.png" />
                    <div class="navval">找“相因”</div>
                </div>
                <div class="navitem">
                    <img src="../../assets/image/home/nav4.png" />
                    <div class="navval">打卡礼</div>
                </div>
            </div>
        </div>
        <div class="huiminbox">
            <div class="tishi">提示23</div>
            <div class="huiminval">
                <span>使用</span>
                <span style="color: #F18B36">惠民优惠券</span>
                <span>有机会再次获得福利哦！</span>
            </div>
        </div>
        <undernav :navunderarr="navunderarr" @undernavfn="undernavfn"></undernav>
        <div class="undercont">
            <div class="underitem">
                <div class="listtitle">
                    <img src="../../assets/image/home/biaotiyangshi.png">
                    <div class="listtitleval">餐饮</div>
                </div>
                <div class="listcont">
                    <div class="listitem" v-for="item in listarr">
                        <goodslist :itemobj="item"></goodslist>
                    </div>
                </div>
                <div class="morebox" v-if="listarr.length>0">{{loadval}}</div>
            </div>
        </div>
        <!--<footnav :footobj="footobj"></footnav>-->
    </div>
</template>

<script>
    // import { Swiper,SwiperItem } from 'vux'
    import {Carousel} from 'ant-design-vue'
    import footnav from '../../components/footnav'
    import goodslist from '../../components/goodslist'
    import undernav from '../../components/undernav'
    import http from '../../utils/http'
    export default {
        components: {
            ACarousel:Carousel,
            footnav,
            goodslist,
            undernav,
        },
        name: "home",
        data() {
            return {
                navunderarr:[],
                nowtypeid:-1,
                listarr:[],
                bannerobj:[],
                footobj:[
                    {val:'首页',icon:'icon-shouye',color:'rgb(255,131,21)'},
                    {val:'商城',icon:'icon-shop',color:'rgb(50,50,50)'},
                    {val:'评选',icon:'icon-order',color:'rgb(50,50,50)'},
                    {val:'我的',icon:'icon-user',color:'rgb(50,50,50)'},
                ],
                // 下拉
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
                console.log(this.startY)
                console.log(this.endy)
                if(this.endy<this.startY&&this.isunder){
                    this.nowpage +=1
                    this.getlist(true)
                }
            },//手势滑动结束



            bannerclick(item){
                window.location.href = item.url
            },
            tomore(){
                this.$router.push({path:'/shop'})
            },
            getbanner(){
                let _this = this
                http.post('/api/photo/index',{otherCategoryId:2}).then(res => {
                    if (res.code == 0) {
                        _this.bannerobj = res.data
                    } else {
                    }
                })
            },
            undernavfn(item){
                for(let i = 0;i<this.navunderarr.length;i++){
                    this.navunderarr[i].active = false
                }
                this.nowtypeid = item.id
                item.active = true
                this.nowpage = 1
                this.getlist(false)
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
            getlist(type){
                let _this = this
                if(!type){
                    _this.listarr = []
                }
                var data  ={
                    pageNo:this.nowpage,
                    pageSize:this.pagenum,
                    categoryParentId:this.nowtypeid,
                    orderField:'id',
                    orderType:'asc',
                    name:'',
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
                        _this.setnav(res.data)
                    }else {
                    }
                })
            }
        },
        mounted() {
        },
        created() {
            this.getbanner()
            this.getnavfn()
            this.$store.dispatch('changeShowFootFun', true)
        },
    }
</script>

<style>
    .container{
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .bgimg{
        width: 100%;
    }
    .topnavcont{
        width: 100%;
        background-color: #fff;
        position: relative;
        top: -11px;
    }
    .tonavbox{
        width: 90%;
        margin: 0 auto;
        border-radius: 4px;
        box-shadow: 0 5px 10px rgb(200,200,200);
        background-color: #fff;
        padding: 10px 15px;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        z-index: 1000;
        position: relative;
        top: -11px;
    }
    .navval{
        margin-top: 5px;
        font-weight: bold;
    }
    .huiminbox{
        width: 90%;
        background-color: #F7F7F7;
        height: 46px;
        border-radius: 23px;
        margin: 0 auto;
        margin-top: 10px;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
    }
    .tishi{
        background-color: #F18B36;
        padding: 0px 7px;
        height: 20px;
        line-height: 20px;
        box-sizing: border-box;
        color: white;
        margin-top: 3px;
    }
    .huiminval{
        height: 20px;
        margin-top: 3px;
        line-height: 20px;
        margin-left: 8px;
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
        padding-bottom: 20px;
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
</style>
<style scoped>
    /* For demo */
    .ant-carousel >>> .slick-slide {
        text-align: center;
        height: 160px;
        line-height: 160px;
        background: #364d79;
        overflow: hidden;
    }

    .ant-carousel >>> .custom-slick-arrow {
        width: 25px;
        height: 25px;
        font-size: 25px;
        color: #fff;
        background-color: rgba(31, 45, 61, 0.11);
        opacity: 0.3;
    }
    .ant-carousel >>> .custom-slick-arrow:before {
        display: none;
    }
    .ant-carousel >>> .custom-slick-arrow:hover {
        opacity: 0.5;
    }

    .ant-carousel >>> .slick-slide h3 {
        color: #fff;
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
