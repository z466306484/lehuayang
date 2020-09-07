<template>
    <div style="padding: 22px">
        <a-row>
            <a-card title="折扣活动管理" :bordered="false"
                    :headStyle="{backgroundColor:'#00A0E9',borderRadius:'5px'}"
                    :bodyStyle="{padding:'10px',borderRadius:'5px',textAlign:'center'}">
                <div v-if="zkData.length>0">
                    <a-list>
                        <a-list-item v-for="d,index in zkData" :key="index">
                            <a-col :span="12">{{d.type.label}}低至{{d.discount}}折</a-col>
                            <a-col :span="10">
                                <a @click="edit(d,{value: 'zk', label: '折扣'})">修改</a>
                                <a-divider type="vertical"/>
                                <a style="color: #DD1D1D" @click="deleteData('zk')">删除</a>
                            </a-col>
                        </a-list-item>
                    </a-list>
                </div>
                <p v-else>暂无数据</p>
            </a-card>
        </a-row>
        <a-row>
            <a-card title="满减活动管理" :bordered="false" style="margin-top: 15px"
                    :headStyle="{backgroundColor:'#00A0E9',borderRadius:'5px'}"
                    :bodyStyle="{padding:'10px',borderRadius:'5px',textAlign:'center'}">
                <div v-if="mjData.length>0">
                    <a-list>
                        <a-list-item v-for="d,index in mjData" :key="index">
                            <a-col :span="12">{{d.type.label}}满{{d.full}}减{{d.subtract}}</a-col>
                            <a-col :span="10">
                                <a @click="edit(d,{value: 'mj', label: '满减'})">修改</a>
                                <a-divider type="vertical"/>
                                <a style="color: #DD1D1D" @click="deleteData('mj',d)">删除</a>
                            </a-col>
                        </a-list-item>
                    </a-list>
                </div>
                <p v-else>暂无数据</p>
            </a-card>
        </a-row>
        <a-row>
            <a-card title="有礼活动管理" :bordered="false" style="margin-top: 15px"
                    :headStyle="{backgroundColor:'#00A0E9',borderRadius:'5px'}"
                    :bodyStyle="{padding:'10px',borderRadius:'5px',textAlign:'center'}">
                <div v-if="ylData.length>0">
                    <a-list>
                        <a-list-item v-for="d,index in ylData" :key="index">
                            <a-col :span="12">{{d.content}}</a-col>
                            <a-col :span="10">
                                <a @click="edit(d,{value: 'yl', label: '有礼'})">修改</a>
                                <a-divider type="vertical"/>
                                <a style="color: #DD1D1D" @click="deleteData('yl')">删除</a>
                            </a-col>
                        </a-list-item>
                    </a-list>
                </div>
                <p v-else>暂无数据</p>
            </a-card>
        </a-row>
        <a-row style="text-align: center;margin-top: 50px">
            <a-button style="width: 100px" type="primary" @click="add">添加</a-button>
        </a-row>
    </div>
</template>

<script>
    import {Row, Col, Card, Button, List, Divider, message} from 'ant-design-vue'
    import http from '../../../utils/http'

    const dataUrl = {
        getUserData: '/api/user/index',
        updateData: '/api/merchant/update'
    }
    export default {
        components: {
            ARow: Row,
            ACol: Col,
            ACard: Card,
            AButton: Button,
            AList: List,
            AListItem: List.Item,
            ADivider: Divider
        },
        name: "CampaignList",
        mounted() {
            this.loader()
        },
        data() {
            return {
                zkData: [],
                mjData: [],
                ylData: [],
            }
        },
        methods: {
            deleteData(key, data) {
                let merchant = JSON.parse(JSON.stringify(this.$store.state.merchant))
                if ('zk' == key) {
                    merchant.type = 0
                    merchant.discount = 0
                } else if ('mj' == key) {
                    let reduce = JSON.parse(merchant.reduce)
                    if (reduce && reduce instanceof Array) {
                        let deleteIndex = null
                        reduce.forEach((item, index) => {
                            if (item.id == data.id) {
                                deleteIndex = index
                                return
                            }
                        })
                        if (deleteIndex != null) {
                            reduce.splice(deleteIndex, 1)
                        }
                    }
                    merchant.reduce = JSON.stringify(reduce) ? JSON.stringify(reduce) : ''
                } else if ('yl' == key) {
                    merchant.gift = ''
                }
                http.post(dataUrl.updateData, merchant).then(res => {
                    if (res.code == 0) {
                        this.loader()
                        message.success(res.msg)
                    } else {
                        message.warning(res.msg)
                    }
                })
            },
            edit(data, key) {
                this.$router.push({name: 'campaignEdit', params: {data: data, key: key}})
            },
            loader() {
                http.post(dataUrl.getUserData, {
                    phone: this.$store.state.user.phone
                }).then(res => {
                    if (res.code == 0) {
                        this.$store.dispatch('addUserFun', res.data.user)
                        this.$store.dispatch('addMerchantFun', res.data.merchant)
                        let merchant = res.data.merchant
                        this.zkData = new Array
                        this.mjData = new Array
                        this.ylData = new Array
                        if (merchant) {
                            if (merchant.type != null && merchant.discount != null && merchant.discount != 0) {
                                this.zkData.push({
                                    type: merchant.type == '0' ? {value: '0', label: '部分'} : {value: '1', label: '全场'},
                                    discount: merchant.discount
                                })
                            }
                            if (merchant.reduce) {
                                let mj = JSON.parse(merchant.reduce)
                                if (mj instanceof Array) {
                                    this.mjData = mj
                                }
                            }
                            if (merchant.gift) {
                                this.ylData.push(JSON.parse(merchant.gift))
                            }
                        }
                    }
                })
            },
            add() {
                this.$router.push({name: 'campaignEdit'})
            },
        }
    }
</script>

<style scoped>

</style>