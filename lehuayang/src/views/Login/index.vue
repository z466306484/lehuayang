<template>
    <div>
        <a-row>
            <div class="header">
                <a-row>
                    <div style="margin-top: 61px">
                        <a-col :span="3"></a-col>
                        <a-col :span="6"><img :src="logo"></a-col>
                        <a-col :span="11" style="margin-top: 10px;margin-left: 17px">
                            <a-row><span style="font-size: 29px;color: #FFFFFF">乐活ZUI华阳</span></a-row>
                            <a-row style="margin-top: 10px"><span style="font-size: 17px;color: #FFFFFF">用户登录</span>
                            </a-row>
                        </a-col>
                        <a-col :span="4"></a-col>
                    </div>
                </a-row>
            </div>
        </a-row>
        <a-row style="padding: 50px 17px 80px 17px">
            <a-row>
                <a-col :span="5" style="text-align: right;padding: 0px 5px"><span
                        style="font-weight: bold;font-size: 16px;line-height: 40px;">手机号:</span></a-col>
                <a-col :span="11">
                    <a-input size="large" placeholder="请输入手机号" v-model="phone" @change="phoneChange"></a-input>
                </a-col>
                <a-col :span="4" style="margin-left: 10px">
                    <a-button size="large" @click="sendNote" v-if="!isSend" class="login-button">获取验证码</a-button>
                    <a-button size="large" disabled v-else>{{time}}s</a-button>
                </a-col>
            </a-row>
            <a-row style="margin-top: 12px">
                <a-col :span="5" style="text-align: right;padding: 0px 5px"><span
                        style="font-weight: bold;font-size: 16px;line-height: 40px;">验证码:</span></a-col>
                <a-col :span="19">
                    <a-input size="large" placeholder="请输入验证码" v-model="authCode" @change="authCodeChange"></a-input>
                </a-col>
            </a-row>
            <a-row style="margin-top: 12px">
                <a-col style="padding: 0px 25px"><span
                        style="font-weight: bold;font-size: 14px;line-height: 40px;"><a-checkbox
                        :checked="checked" @change="checkedChange"/><label style="margin-left: 5px">我同意<a @click="read">《用户使用协议》</a></label></span>
                </a-col>
            </a-row>
            <a-row>
                <span style="font-weight: bold;font-size: 12px;line-height: 14px;">
                    特别说明：您的手机号码我们仅用于登录判断，如不在使用此服
                务可联系我们删除数据。
                </span>
            </a-row>
            <a-row style="text-align: center;font-size: 16px;margin-top: 80px">
                <a-button style="width: 300px" @click="userLogin" size="large" class="login-button">登录</a-button>
            </a-row>
        </a-row>
        <a-modal
                title="《用户使用协议》"
                :visible="readVisible"
                @ok="readOk"
                @cancel="readCancel"
                :destroyOnClose="true"
                :closable="false"
                okText="同意"
                cancelText="不同意"
        >
            <div v-html="agreementContent"></div>
        </a-modal>
    </div>
</template>

<script>
    import {Row, Col, Checkbox, Button, Input, message, Modal} from 'ant-design-vue'
    import http from '../../utils/http'

    const dataUrl = {
        sendNote: '/api/sms/send',
        login: '/api/user/userLogin',
        getAgreement: '/api/agreement/get'
    }
    export default {
        name: "login",
        components: {
            ARow: Row,
            ACol: Col,
            AButton: Button,
            AInput: Input,
            ACheckbox: Checkbox,
            AModal: Modal
        },
        data() {
            return {
                logo: require('../../assets/image/login/logo.png'),
                checked: true,
                phone: null,
                oldPhone: null,
                authCode: null,
                oldAuthCode: null,
                readVisible: false,
                agreementContent: null,
                isSend: false,
                time: null,
                timer: null
            }
        },
        mounted() {
            sessionStorage.clear()
        },
        methods: {
            read() {
                this.readVisible = true
                http.post(dataUrl.getAgreement, {id: 1}).then(res => {
                    if (res.code == 0) {
                        const h = this.$createElement
                        this.agreementContent = res.data.content
                    } else {
                        message.warning(res.msg)
                    }
                })
            },
            readOk() {
                this.readVisible = false
                this.checked = true
            },
            readCancel() {
                this.readVisible = false
                this.checked = false
            },
            checkedChange(e) {
                this.checked = e.target.checked
            },
            phoneChange(e) {
                let reg = new RegExp("^[0-9]*$");
                if (!reg.test(e.target.value)) {
                    this.phone = this.oldPhone
                } else {
                    this.oldPhone = this.phone
                }
            },
            authCodeChange(e) {
                let reg = new RegExp("^[0-9]*$");
                if (!reg.test(e.target.value)) {
                    this.authCode = this.oldAuthCode
                } else {
                    this.oldAuthCode = this.authCode
                }
            },
            sendNote() {
                let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if (!reg.test(this.phone)) {
                    message.warning('请输入有效的手机号码')
                    return
                }
                http.post(dataUrl.sendNote, {phoneNumbers: this.phone}).then(res => {
                    if (res.code == 0) {
                        this.isSend = true
                        this.time = 60
                        this.timer = setInterval(() => {
                            this.time -= 1
                            if (this.time == 0) {
                                this.isSend = false
                                window.clearInterval(this.timer)
                            }
                        }, 1000)
                        message.success(res.msg)
                    } else {
                        message.warning(res.msg)
                    }
                })
            },
            userLogin() {
                if (this.checked) {
                    let regPhone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
                    let regAuthCode = /^[0-9]{6}$/
                    if (!regPhone.test(this.phone)) {
                        message.warning('请输入有效的手机号码')
                        return
                    }
                    if (!regAuthCode.test(this.authCode)) {
                        message.warning('请输入有效的验证码')
                        return
                    }
                    http.post(dataUrl.login, {phone: this.phone, code: this.authCode}).then(res => {
                        if (res.code == 0) {
                            sessionStorage.isAuth = true
                            this.$store.dispatch('addUserFun', res.data.user)
                            this.$store.dispatch('addMerchantFun', res.data.merchant)
                            this.$router.push({name: 'main'})
                        } else {
                            message.warning(res.msg)
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .header {
        background: url("../../assets/image/login/beijing.png") no-repeat;
        background-size: cover;
        height: 236px;
        width: 100%;
    }

    .login-button {
        background-color: #F18B36;
        color: #FFFFFF;
    }
</style>