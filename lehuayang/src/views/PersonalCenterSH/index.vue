<template>
    <div>
        <a-row>
            <div class="header">
                <a-row>
                    <a-col :span="8"></a-col>
                    <a-col :span="8" class="head-portrait">
                        <a-avatar :src="headPortrait" style="height: 82px;width: 82px"/>
                    </a-col>
                    <a-col :span="8" class="saoyisao">
                        <a-col :span="6"></a-col>
                        <a-col :span="6"></a-col>
                        <a-col :span="6" style="text-align: center">
                            <img :src="saoyisao" v-show="this.$store.state.merchant" @click="wxSaoYiSao">
                        </a-col>
                        <a-col :span="6"></a-col>
                    </a-col>
                </a-row>
                <div v-if="this.$store.state.user">
                    <a-row class="user-name">
                        {{userName}}
                    </a-row>
                    <a-row class="store-name" v-show="this.$store.state.merchant">
                        <img :src="dianpu" style="height: 19px;width: 19px">
                        <span style="margin-left: 4px">绑定商铺：{{storeName}}</span>
                    </a-row>
                </div>
                <div v-else>
                    <a-row class="user-name">
                        未登录
                    </a-row>
                    <a-row class="user-login">
                        <router-link :to="{name:'login'}">
                            <a-button>登录</a-button>
                        </router-link>
                    </a-row>
                </div>
            </div>
        </a-row>

        <a-row class="personal-card">
            <a-card :bordered="false" :bodyStyle="{padding:'0px 15px 0px 15px'}" style="border-radius: 8px">
                <a-list itemLayout="horizontal">
                    <router-link :to="{name:'personal'}" tag="li" class="underline">
                        <a-list-item><img :src="gerenziliao"><span class="wenzi-span">个人资料{{saoYiSaoData}}</span><img
                                :src="jiantou">
                        </a-list-item>
                    </router-link>
                    <router-link :to="{name:'card'}" tag="li" :class="this.$store.state.merchant?'':'underline'">
                        <a-list-item><img :src="card"><span class="wenzi-span">卡卷中心</span><img :src="jiantou">
                        </a-list-item>
                    </router-link>
                    <!-- <router-link :to="{name:'comment'}" tag="li">
                    <a-list-item><img :src="pinglun"><span class="wenzi-span">评论管理</span><img :src="jiantou">
                    </a-list-item>
                    </router-link> -->
                    <router-link :to="{ name: 'apply'}" tag="li"
                                 v-show="this.$store.state.merchant?false:isAudit?false:true">
                        <a-list-item><img :src="shanghurenzhen"><span class="wenzi-span">商户申请</span><img
                                :src="jiantou">
                        </a-list-item>
                    </router-link>
                </a-list>
            </a-card>
        </a-row>
        <a-row class="houtai-card" v-show="this.$store.state.merchant">
            <a-card :bordered="false" :bodyStyle="{padding:'0px 15px 0px 15px'}"
                    :headStyle="{textAlign:'center',fontWeight: 'bold'}" style="border-radius: 8px">
                <template slot="title">
                    商户后台
                </template>
                <a-list itemLayout="horizontal">
                    <router-link :to="{ name: 'attestation'}" tag="li"
                                 :class="(this.$store.state.user&&this.$store.state.user.type == 1) || this.$store.state.merchant ?'underline':''"
                                 v-show="isAudit">
                        <a-list-item><img :src="shanghurenzhen"><span class="wenzi-span">商户认证</span><img
                                :src="jiantou">
                        </a-list-item>
                    </router-link>
                    <router-link :to="{ name: 'management'}" tag="li" class="underline"
                                 v-show="this.$store.state.merchant">
                        <a-list-item><img :src="xinxi"><span class="wenzi-span">商户信息管理</span><img :src="jiantou">
                        </a-list-item>
                    </router-link>
                    <router-link :to="{name:'goods'}" tag='li' class="underline" v-show="this.$store.state.merchant">
                        <a-list-item><img :src="shangpin"><span class="wenzi-span">商品管理</span><img :src="jiantou">
                        </a-list-item>
                    </router-link>
                    <router-link :to="{ name: 'campaignList'}" tag="li" class="underline"
                                 v-show="this.$store.state.merchant">
                        <a-list-item><img :src="yingxiao"><span class="wenzi-span">营销活动管理</span><img :src="jiantou">
                        </a-list-item>
                    </router-link>
                    <!-- <router-link :to="{ name: 'statistics'}" tag="li" class="underline"
                                 v-show="this.$store.state.merchant">
                        <a-list-item><img :src="tongji"><span class="wenzi-span">核销统计</span><img :src="jiantou">
                        </a-list-item>
                    </router-link> -->
                    <router-link :to="{ name: 'environment'}" tag="li"
                                 :class="this.$store.state.user&&this.$store.state.user.type == 1?'underline':''"
                                 v-show="this.$store.state.merchant">
                        <a-list-item><img :src="huanjing"><span class="wenzi-span">环境照片管理</span><img :src="jiantou">
                        </a-list-item>
                    </router-link>
                    <router-link :to="{ name: 'staffManagement'}" tag="li"
                                 v-show="this.$store.state.user&&this.$store.state.user.type == 1">
                        <a-list-item><img :src="yuangong"><span class="wenzi-span">员工管理</span><img :src="jiantou">
                        </a-list-item>
                    </router-link>
                </a-list>
            </a-card>
        </a-row>
    </div>
</template>

<script>
    import {Row, Col, Avatar, Card, Icon, List, Button, Modal} from 'ant-design-vue'
    import http from '../../utils/http'
    import wx from 'weixin-js-sdk'

    const confirm = Modal.confirm
    const dataUrl = {
        getAuditInfo: '/api/merchantAudit/index',
        getUserData: '/api/user/index',
    }
    export default {
        components: {
            ARow: Row,
            ACol: Col,
            AAvatar: Avatar,
            ACard: Card,
            AList: List,
            AListItem: List.Item,
            AListItemMeta: List.Item.Meta,
            AIcon: Icon,
            AButton: Button,
        },
        name: "PersonalCenterSH",
        mounted() {
            this.loader()
        },
        beforeRouteLeave(to, from, next) {
            if (this.$store.state.user) {
                next()
            } else {
                if (to.path === '/login') {
                    next()
                } else {
                    let _this = this
                    confirm({
                        title: '用户尚未登录',
                        content: '当前您尚未登录是否前往进行登录？',
                        okText: '是',
                        okType: 'danger',
                        cancelText: '否',
                        onOk() {
                            _this.$router.push({name: 'login'})
                        },
                        onCancel() {
                        },
                    })
                }
            }
        },
        data() {
            return {
                headPortrait: require('../../assets/image/personalcenterSH/head-portrait.png'),
                saoyisao: require('../../assets/image/personalcenterSH/saoyisao.png'),
                dianpu: require('../../assets/image/personalcenterSH/dianpu.png'),
                gerenziliao: require('../../assets/image/personalcenterSH/个人资料.png'),
                card: require('../../assets/image/personalcenterSH/card.png'),
                pinglun: require('../../assets/image/personalcenterSH/评论.png'),
                shanghurenzhen: require('../../assets/image/personalcenterSH/商户认证.png'),
                shangpin: require('../../assets/image/personalcenterSH/商品.png'),
                xinxi: require('../../assets/image/personalcenterSH/信息.png'),
                yingxiao: require('../../assets/image/personalcenterSH/营销.png'),
                tongji: require('../../assets/image/personalcenterSH/tongji.png'),
                huanjing: require('../../assets/image/personalcenterSH/huanjing.png'),
                yuangong: require('../../assets/image/personalcenterSH/yuangong.png'),
                jiantou: require('../../assets/image/personalcenterSH/jiantouarrow487.png'),
                userName: '******',
                storeName: '******',
                isAudit: false,
                saoYiSaoData: null
            }
        },
        methods: {
            loaderWXConfig() {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: 'wx9a1f9766b3bbd453', // 必填，公众号的唯一标识
                    timestamp: 1586852101, // 必填，生成签名的时间戳
                    nonceStr: 'adadadadasdasdad', // 必填，生成签名的随机串
                    signature: '2e793cf0dac818eccec19b8ca4cef64e7006bfe7',// 必填，签名
                    jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表
                })
                wx.ready(() => {
                    console.log('微信js接口配置成功')
                })
                wx.error(res => {
                    console.log("微信js接口配置失败")
                })
            },
            wxSaoYiSao() {
                this.loaderWXConfig()
                let _this = this
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function (res) {
                        let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                        _this.saoYiSaoData = result
                        _this.saoYiSaoResult()
                    }
                })
            },
            saoYiSaoResult() {
                this.$router.push({name: 'scanVerification', params: {data: this.saoYiSaoData}})
            },
            loader() {
                if (this.$store.state.user && this.$store.state.user.phone) {
                    http.post(dataUrl.getUserData, {
                        phone: this.$store.state.user.phone
                    }).then(res => {
                        if (res.code == 0) {
                            this.$store.dispatch('addUserFun', res.data.user)
                            this.$store.dispatch('addMerchantFun', res.data.merchant)
                            let phone = this.$store.state.user ? this.$store.state.user.phone + "" : ""
                            this.userName = this.$store.state.user ? this.$store.state.user.nickname ? this.$store.state.user.nickname : phone.substr(0, 3) + "****" + phone.substr(7) : '**********'
                            this.storeName = this.$store.state.merchant ? this.$store.state.merchant.name ? this.$store.state.merchant.name : '尚未绑定商铺' : '尚未绑定商铺'
                            if (this.$store.state.merchant) {
                                http.post(dataUrl.getAuditInfo, {
                                    id: this.$store.state.merchant.id
                                }).then(res => {
                                    if (res.code == 0) {
                                        if (res.data != null) {
                                            this.isAudit = true
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            },
        }
    }
</script>

<style scoped>
    .header {
        background: url("../../assets/image/personalcenterSH/beijing.png") no-repeat;
        background-size: cover;
        height: 263px;
        width: 100%;
    }

    .head-portrait {
        margin-top: 30px;
        text-align: center;
    }

    .user-login {
        text-align: center;
        margin-top: 5%;
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 2px;
    }

    .user-login button {
        background-color: #ffffff;
        color: #02ABFD;
    }

    .saoyisao {
        margin-top: 34px;
    }

    .user-name {
        text-align: center;
        margin-top: 11px;
        font-size: 18px;
        font-weight: bold;
        color: #F8F8F8;
        letter-spacing: 2px;
    }

    .store-name {
        margin-top: 13px;
        text-align: center;
        font-size: 14px;
        color: #F8F8F8;
        letter-spacing: 2px;
    }

    .personal-card {
        padding: 22px;
        font-size: 21px;
        font-weight: bold;
    }

    .houtai-card {
        padding: 0 22px 92px 22px;
        font-size: 21px;
        font-weight: bold;
    }

    .wenzi-span {
        width: 85%;
    }

    .underline {
        border-bottom: 1px solid #e8e8e8;
    }
</style>