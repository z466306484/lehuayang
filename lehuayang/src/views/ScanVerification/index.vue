<template>
    <div style="padding: 22px">
        <a-card :bordered="false" style="border:1px dashed #cccccc">
            <a-row style="text-align: center"><label class="xh">-----</label>优惠券信息<label class="xh">-----</label>
            </a-row>
            <a-row class="wz-row">优惠券类型：{{data.name}}</a-row>
            <a-row class="wz-row">优惠券金额：￥{{data.money}}</a-row>
            <a-row class="wz-row">使 用 限 制：{{data.astrict}}</a-row>
            <a-row class="wz-row">优惠券状态：{{data.state}}</a-row>
            <a-row style="text-align: center"><label class="xh">-----</label>商户信息<label class="xh">-----</label></a-row>
            <a-row class="wz-row">商户名称：{{data.merchant.name}}</a-row>
            <a-row class="wz-row">商户类型：{{data.merchant.type}}</a-row>
            <a-row class="wz-row">行业细分：{{data.merchant.categorical}}</a-row>
            <a-row>消费金额：
                <a-input-number placeholder="请填写顾客本次消费金额" style="width: 200px" :min="0" v-model="monetary"
                                :precision="2"
                                :formatter="value => `￥ ${value}`"/>
            </a-row>
        </a-card>
        <a-row style="text-align: center;margin-top: 156px">
            <a-button style="width: 140px" class="hexiao-button" @click="hexiao">确认核销</a-button>
        </a-row>
    </div>
</template>

<script>
    import {Row, Button, Card, InputNumber, message} from 'ant-design-vue'
    import http from '../../utils/http'

    const dataUrl = {
        getCategoricalInfo: '/api/category/index',
        couponUpdate: '/api/merchantCoupon/update'
    }
    export default {
        components: {
            ACard: Card,
            ARow: Row,
            AButton: Button,
            AInputNumber: InputNumber
        },
        name: "scanVerification",
        mounted() {
            this.loader()
        },
        data() {
            return {
                scanData: this.$route.params.data ? JSON.parse(this.$route.params.data) : null,
                data: {
                    name: '********',
                    money: '********',
                    astrict: '********',
                    state: '********',
                    merchant: {
                        name: '********',
                        type: '********',
                        categorical: '********'
                    }
                },
                monetary: null
            }
        },
        methods: {
            loader() {
                if (this.scanData) {
                    if (this.scanData.merchantId) {
                        let flag = true
                        let merchantIds = this.scanData.merchantId.splice(',')
                        if (merchantIds instanceof Array) {
                            merchantIds.forEach(e => {
                                if (e == this.$store.state.merchant.id) {
                                    flag = false
                                }
                            })
                        }
                        if (true) {
                            message.warning('该优惠卷无法在当前店铺使用')
                            this.$router.push({name: 'main'})
                            return
                        }
                    }
                    let data = {}
                    data.name = this.scanData.name
                    data.money = this.scanData.money
                    data.astrict = this.scanData.astrict
                    //是否过期
                    let isOverdue = false
                    //是否兑换
                    let isConversion = false
                    if (this.scanData.ruinUserId) {
                        isConversion = true
                    }
                    let nowDate = new Date()
                    if (nowDate.getTime() > this.scanData.expiryTime) {
                        isOverdue = true
                    }
                    if (!isOverdue && !isConversion) {
                        data.state = '有效'
                    } else {
                        data.state = '失效'
                    }
                    let merchant = {}
                    merchant.name = this.$store.state.merchant.name
                    http.post(dataUrl.getCategoricalInfo, {}).then(res => {
                        if (res.code == 0) {
                            if (res.data instanceof Array) {
                                res.data.forEach(e => {
                                    if (e.id == this.$store.state.merchant.categoryParentId) {
                                        merchant.type = e.name
                                    }
                                    if (e.id == this.$store.state.merchant.categoryId) {
                                        merchant.categorical = e.name
                                    }
                                })
                                data.merchant = merchant
                                this.data = data
                            }
                        }
                    })
                } else {
                    message.warning('未获取到相关二维码信息')
                    this.$router.push({name: 'main'})
                }
            },
            hexiao() {
                if (this.monetary > this.scanData.money) {
                    message.warning('消费金额不能小于优惠券金额')
                    return
                }
                http.post(dataUrl.couponUpdate, {
                    id: this.scanData.id,
                    userId: this.scanData.userId,
                    ruinUserId: this.$store.state.user.id,
                    merchantId: this.scanData.merchantId ? this.scanData.merchantId : null,
                    ruinMerchantId: this.$store.state.merchant.id,
                    monetary: this.monetary
                }).then(res => {
                    if (res.code == 0) {
                        message.success('核销成功')
                        this.$router.push({name: 'main'})
                    } else {
                        message.warning(res.msg)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .hexiao-button {
        background-color: #F18B36;
        color: #FFFFFF;
    }

    .xh {
        color: #cccccc;
        padding: 0px 5px 0px 5px;
    }

    .wz-row {
        line-height: 32px;
    }
</style>