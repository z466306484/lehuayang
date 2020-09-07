<template>
    <div>
        <a-skeleton active avatar :paragraph="{rows: 2}" style="padding: 22px 22px 0px 22px"
                    :loading="loading">
            <div>
                <a-row :key="index" v-for="(item,index) in staffData" style="padding: 0px 0px 22px 0px">
                    <a-card :bordered="false" :bodyStyle="{padding:'5px'}" style="border-radius: 5px">
                        <a-row>
                            <a-col :span="6">
                                <a-avatar :size="64" :src="item.imgSrc"></a-avatar>
                            </a-col>
                            <a-col :span="10">
                                <p style="margin:5px 0px 0px 0px;font-weight:bold;font-size: 21px">{{item.name}}</p>
                                <p style="font-size: 11px">{{item.phone}}</p>
                            </a-col>
                            <a-col :span="8" style="line-height: 64px">
                                <a-button type="danger" block icon="disconnect" @click="cancel(item.id)"
                                          v-show="userPhone!=item.phone">解除关联
                                </a-button>
                            </a-col>
                        </a-row>
                    </a-card>
                </a-row>
                <a-row style="padding: 0px 0px 22px 0px;text-align: center" v-show="staffData.length == 0">暂无数据</a-row>
            </div>
        </a-skeleton>
        <a-row style="text-align: center; margin-top: 50px">
            <a-button @click="drawerOpen">添加员工</a-button>
        </a-row>
        <a-drawer @close="drawerOnClose"
                  placement='top'
                  :height="200"
                  :destroyOnClose="true"
                  title="添加员工"
                  :drawerStyle="{backgroundColor:'#F1FCFF'}"
                  :headerStyle="{backgroundColor:'#F1FCFF',fontWeight:'bold'}"
                  :visible="drawerVisible">
            <a-row>
                <a-input placeholder="请输入需要绑定的员工手机号" v-model="addPhone" @change="phoneChange"></a-input>
            </a-row>
            <a-row style="text-align: center;margin-top: 20px">
                <a-button @click="addOk">确定</a-button>
            </a-row>
        </a-drawer>
    </div>

</template>

<script>
    import {Row, Button, Card, Col, Avatar, Drawer, Input, message, Skeleton} from 'ant-design-vue'
    import http from '../../utils/http'

    const dataUrl = {
        getData: '/api/user/list',
        untying: '/api/user/untying',
        add: '/api/user/bind'
    }
    export default {
        name: "StaffManagement",
        components: {
            ARow: Row,
            AButton: Button,
            ACard: Card,
            ACol: Col,
            AAvatar: Avatar,
            ADrawer: Drawer,
            AInput: Input,
            ASkeleton: Skeleton
        },
        mounted() {
            this.loader()
        },
        data() {
            return {
                staffData: [],
                drawerVisible: false,
                addPhone: null,
                oldAddPhone: null,
                loading: true,
                userPhone: this.$store.state.user ? this.$store.state.user.phone : null
            }

        },
        methods: {
            loader() {
                this.loading = true
                http.post(dataUrl.getData, this.$store.state.merchant ? {merchantId: this.$store.state.merchant.id} : {}).then(res => {
                    if (res.code == 0) {
                        let data = new Array()
                        if (res.data instanceof Array) {
                            res.data.forEach(e => {
                                data.push({
                                    id: e.id,
                                    imgSrc: e.headPortrait,
                                    name: e.nickname,
                                    phone: e.phone
                                })
                            })
                        }
                        this.staffData = data
                    } else {
                        message.warning(res.msg)
                    }
                }).then(() => {
                    this.loading = false
                })
            },
            drawerOnClose() {
                this.drawerVisible = false
                this.addPhone = null
            },
            drawerOpen() {
                this.drawerVisible = true
            },
            addOk() {
                let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if (!reg.test(this.addPhone)) {
                    message.warning('请输入有效的手机号码')
                    return
                }
                http.post(dataUrl.add, {
                    phone: this.addPhone,
                    merchantId: null
                }).then(res => {
                    if (res.code == 0) {
                        message.success(res.msg)
                        this.drawerVisible = false
                        this.addPhone = null
                    } else {
                        message.warning(res.msg)
                    }
                })
            },
            cancel(id) {
                if (id) {
                    http.post(dataUrl.untying, {id: id}).then(res => {
                        if (res.code == 0) {
                            message.success(res.msg)
                            this.loader()
                        } else {
                            message.warning(res.msg)
                        }
                    })
                }
            },
            phoneChange(e) {
                let reg = new RegExp("^[0-9]*$");
                if (!reg.test(e.target.value)) {
                    this.addPhone = this.oldAddPhone
                } else {
                    this.oldAddPhone = this.addPhone
                }
            },
        }
    }
</script>

<style scoped>

</style>