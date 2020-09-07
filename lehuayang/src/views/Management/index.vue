<template>
    <div>
        <a-form :form="form" style="padding: 22px ">
            <a-form-item label="门店地址">
                <a-input placeholder="输入商户地址信息精确到门牌号"
                         v-decorator="['address',{ initialValue:formData.address,rules: [{ required: true, message: '请输入地址信息' },{min:1,max:50,message:'最多50个字'}] }]"
                />
            </a-form-item>
            <a-form-item label="人均消费金额">
                <a-input placeholder="填写客观的人均消费数据"
                         v-decorator="['averageCost',{ initialValue:formData.averageCost,rules: [{ required: true, message: '请填写人均消费金额' ,pattern:/^[0-9]*$/}] }]"
                />
            </a-form-item>
            <a-form-item label="门店联系电话">
                <a-input placeholder="门店营业电话"
                         v-decorator="['businessPhone',{ initialValue:formData.businessPhone,rules: [{
						          			required: true,
						          			pattern:/^(\d{8}|\d{11})$/,
						          			message: '请填写8或11位电话号码!'
						          		}] }]"
                />
            </a-form-item>
            <!-- 营业时间 -->
            <!-- <a-form-item label="营业时间">
                <a-row>
                    <a-col :span="10">
                        <a-time-picker @change="onChange" />
                    </a-col>
                    <a-col :span="4" style="text-align:center">——</a-col>
                    <a-col :span="10">
                        <a-time-picker @change="onChange" />
                    </a-col>
                </a-row>
            </a-form-item> -->

            <!-- 地图 -->
            <div>
						<span>
							定位：请在地图上选择您的位置
                            <img :src="dingwei" @click="getMyLocation">
						</span>
                <div id="map" style="width: 100%; height: 16rem;">

                </div>
            </div>
            <!-- 地图 -->
            <div style="margin-top:5%;">
                <span style="font-size: 14px;color: #3B3B3B">以下信息用于消费券补贴发放时用，请如实填写避免资金无法到账!</span>
            </div>
            <a-form-item label="银行账户开户名" style="margin-top: 20px">
                <a-input
                        v-decorator="['accountName',{ initialValue:formData.accountName,rules: [{ required: true, message: '请输入开户名' }] }]"
                />
            </a-form-item>
            <a-form-item label="银行账号">
                <a-input
                        v-decorator="['account',{ initialValue:formData.account,rules: [{ required: true,pattern:/^[1-9]\d*$/, message: '请输入银行账户' }] }]"
                />
            </a-form-item>
            <a-form-item label="开户行">
                <a-input
                        v-decorator="['openingBank',{ initialValue:formData.openingBank,rules: [{ required: true, message: '请输入开户行' }] }]"
                />
            </a-form-item>
            <a-form-item :style="{marginTop:'8px',textAlign:'center'}">
                <a-button type="primary" @click="handleSubmit" :loading="submitting" style="width: 300px">保存
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    import {Form, Input, Button, Row, Col, Select, Upload, Icon, Checkbox, message, Modal,TimePicker} from 'ant-design-vue'
    import http from '../../utils/http'
    import txMap from '../../utils/txMap'

    const dataUrl = {
        add: '/api/merchant/update',
        getData:'/api/merchant/get'
    }
    export default {
        components: {
            AForm: Form,
            AFormItem: Form.Item,
            AInput: Input,
            AButton: Button,
            ARow: Row,
            ACol: Col,
            ASelect: Select,
            ASelectOption: Select.Option,
            ATextArea: Input.TextArea,
            AUpload: Upload,
            AIcon: Icon,
            ACheckbox: Checkbox,
            AModal: Modal,
            ATimePicker:TimePicker
        },
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
            this.initMap()
            this.loader()
        },
        name: "apply",
        data() {
            return {
                mapData: {
                    map: null,
                    longitude: null,
                    latitude: null,
                    marker: null
                },
                urlPrefix: this.$store.state.domainName,
                formData: {},
                loadingZZ: false,
                loadingMT: false,
                dingwei: require('../../assets/image/shenqing/dingwei.png'),
                submitting: false,
                readVisible: false,
                agreementContent: null,
                isSend: false,
                time: null,
                timer: null,
                yzNote: false,
            }
        },
        methods: {
            loader(){
                this.loading=true
                http.post(dataUrl.getData,this.$store.state.user ? {id: this.$store.state.user.merchantId} : {}).then(res =>{
                    if(res.code == 0){
                        this.formData={
                            address:res.data.address,
                            averageCost:res.data.averageCost,
                            businessPhone:res.data.businessPhone,
                            accountName:res.data.accountName,
                            account:res.data.address,
                            openingBank:res.data.openingBank,
                            id:res.data.id,
                            name:res.data.name
                        }
                    }
                })
            },
            // 时间
            // onChange(time, timeString) {
            //     console.log(time, timeString);
            //     time = time.replace(/\-/g, "/");
            //     timeString = timeString.replace(/\-/g, "/");

            // },
            // 时间

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
            submitData(values) {
                http.post(dataUrl.add, {
                    userId: this.$store.state.user.id,
                    address: values.address,
                    averageCost: values.averageCost,
                    businessPhone: values.businessPhone,
                    account: values.account,
                    openingBank: values.openingBank,
                    accountName: values.accountName,
                    longitude: this.mapData.longitude,
                    latitude: this.mapData.latitude,
                }).then(res => {
                    if (res.code == 0) {
                        message.success(res.msg)
                        this.$router.push({name: 'main'})
                    } else {
                        message.warning(res.msg)
                    }
                })
            },
            handleSubmit() {
                    if (this.mapData.longitude && this.mapData.latitude) {
                                this.form.validateFields(
                                    (err, values) => {
                                        if (!err) {
                                            http.post(dataUrl.add, {
                                                address: values.address,
                                                averageCost: values.averageCost,
                                                businessPhone: values.businessPhone,
                                                account: values.account,
                                                openingBank: values.openingBank,
                                                accountName: values.accountName,
                                                longitude: this.mapData.longitude,
                                                latitude: this.mapData.latitude,
                                                id:this.formData.id,
                                                name:this.formData.name
                                            }).then(res => {
                                                if (res.code == 0) {
                                                    this.formData = {
                                                        userId: this.$store.state.user.id,
                                                        address: res.data.address,
                                                        averageCost: res.data.averageCost,
                                                        businessPhone: res.data.businessPhone,
                                                        account: res.data.account,
                                                        openingBank: res.data.openingBank,
                                                        accountName: res.data.accountName,
                                                        longitude: res.data.longitude,
                                                        latitude: res.data.latitude,
                                                    }
                                                    message.success(res.msg)
                                                } else {
                                                    message.warning(res.msg)
                                                }
                                            })
                                        }
                                    },
                                )
                    } else {
                        message.warning('请先在地图上选择商铺地址')
                    }
            },
            initMap() {
                this.mapData.map = txMap.addMap("map", 30.67, 104.07, 8)
                txMap.addMarker(this.mapData)
            },
            getMyLocation() {
                txMap.getMyLocation(this.mapData)
            },
        }
    }
</script>

<style scoped>

</style>