<template>
    <div>
        <a-form :form="form" style="padding: 22px ">
            <a-form-item label="店铺名称">
                <a-input placeholder="商户招牌信息，如黄焖鸡米饭（XX店）"
                         v-decorator="['name',{ initialValue:formData.name,rules: [{ required: true, message: '请输入商户名称' },{min:1,max:15,message:'最多15个字'}] }]"
                />
            </a-form-item>
            <a-form-item label="商户注册名称">
                <a-input placeholder="营业执照注册名称"
                         v-decorator="['licenseName',{ initialValue:formData.licenseName,rules: [{ required: true, message: '请输入商户注册名称' }] }]"
                />
            </a-form-item>
            <a-form-item label="统一社会信用代码">
                <a-input placeholder="统一社会信用代码"
                         v-decorator="['unicode',{ initialValue:formData.unicode,rules: [{
						          			required: true,
						          			pattern:/^[0-9a-zA-Z]*$/g,
						          			message: '请完善信息!'
						          		}] }]"
                />
            </a-form-item>
            <a-form-item label="法人代表或负责人姓名">
                <a-input placeholder="法人代表或负责人姓名"
                         v-decorator="['personCharge',{ initialValue:formData.personCharge,rules: [{ required: true, message: '请完善信息' }] }]"
                />
            </a-form-item>
            <a-form-item label="法人代表或负责人联系电话">
                <a-input placeholder="法人代表或负责人联系电话"
                         v-decorator="['phone',{ initialValue:formData.phone,rules: [{
						          			required: true,
						          			pattern:/^[1-9]\d*$/,
						          			message: '请输入联系电话!'
						          		}] }]"
                />
            </a-form-item>
            <a-form-item v-show="yzNote">
                <a-row>
                    <a-col :span="17">
                        <a-input placeholder="验证码"
                                 v-decorator="['authCode',{ initialValue:formData.authCode }]"

                        />
                    </a-col>
                    <a-col :span="5" style="margin-left: 8px">
                        <a-button type="primary" @click="sendNote" v-if="!isSend">获取验证码</a-button>
                        <a-button disabled v-else>{{time}}s</a-button>
                    </a-col>
                </a-row>
            </a-form-item>
            <a-form-item label="行业">
                <a-row>
                    <a-col :span="12">
                        <a-select :labelInValue="true" v-decorator="[
						          	'categoryParentId',{
						          		initialValue:formData.categoryParentId,
						          		rules: [{ required: true, message: '请选择行业分类' }]
						          	}
						        ]" @change="catalogueChange">
                            <a-select-option v-for="d in industryData" :key="d.id">{{d.name}}</a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="11" style="margin-left: 8px">
                        <a-select :labelInValue="true" v-decorator="[
						          	'catalogueId',{
						          		initialValue:formData.catalogueId,
						          		rules: [{ required: true, message: '请选择行业分类' }]
						          	}
						        ]">
                            <a-select-option v-for="d in catalogueData" :key="d.id">{{d.name}}</a-select-option>
                        </a-select>
                    </a-col>
                </a-row>
            </a-form-item>
            <a-form-item label="所属社区">
                <a-select :labelInValue="true" v-decorator="[
						          	'community',{
						          		initialValue:formData.community,
						          		rules: [{ required: true, message: '选择所属社区' }]
						          	}
						        ]">
                    <a-select-option v-for="d in shequData" :key="d.key">{{d.name}}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="地址">
                <a-input placeholder="输入商户地址信息精确到门牌号"
                         v-decorator="['address',{ initialValue:formData.address,rules: [{ required: true, message: '请输入地址信息' }]}]"
                />
            </a-form-item>
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
            <a-form-item label="商户简介" style="margin-top: 30px">
                <a-text-area placeholder="描述提供服务和特色服务等,夸大描述和虚假信息无法通过认证" :autoSize="{ minRows: 3, maxRows: 5 }"
                             v-decorator="['introduction',{ initialValue:formData.introduction,rules: [{ required: true, message: '请输入商户简介' }]}]"
                />
            </a-form-item>
            <a-form-item label="营业执照上传">
                <a-row>
                    <a-col :span="8">
                        <a-upload
                                name="avatar"
                                listType="picture-card"
                                class="avatar-uploader"
                                :showUploadList="false"
                                :beforeUpload="zzUpload"
                        >
                            <img style="width: 85px;height: 90px" v-if="imageUrlZZ" :src="urlPrefix+imageUrlZZ"
                                 alt="avatar"/>
                            <div v-else>
                                <a-icon :type="loadingZZ ? 'loading' : 'plus'"/>
                                <div class="ant-upload-text">点击上传</div>
                            </div>
                        </a-upload>
                    </a-col>
                    <a-col :span="15">
                        <span style="font-size: 13px;color: #838383">店铺申请信息与营业执照信息一致</span>
                    </a-col>
                </a-row>
            </a-form-item>
            <a-form-item label="门头照上传">
                <a-row>
                    <a-col :span="8">
                        <a-upload
                                name="avatar"
                                listType="picture-card"
                                class="avatar-uploader"
                                :showUploadList="false"
                                :beforeUpload="mtUpload"
                        >
                            <img style="width: 85px;height: 90px" v-if="imageUrlMT" :src="urlPrefix+imageUrlMT"
                                 alt="avatar"/>
                            <div v-else>
                                <a-icon :type="loadingMT ? 'loading' : 'plus'"/>
                                <div class="ant-upload-text">点击上传</div>
                            </div>
                        </a-upload>
                    </a-col>
                    <a-col :span="10">
                        <img :src="shenqingImg" style="width: 200px">
                    </a-col>
                </a-row>
            </a-form-item>
            <div>
                <span style="font-size: 14px;color: #3B3B3B">以下信息用于消费券补贴发放时用，请如实填写避免 资金无法到账</span>
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
            <div>
                <a-row>
                    <a-col style="text-align: center"><span
                            style="font-weight: bold;font-size: 14px;line-height: 40px;"><a-checkbox
                            :checked="checked" @change="checkedChange"/><label style="margin-left: 5px">我同意<a
                            @click="read">《商户使用协议》</a></label></span>
                    </a-col>
                </a-row>
            </div>
            <a-form-item :style="{marginTop:'8px',textAlign:'center'}">
                <a-button type="primary" @click="handleSubmit" :loading="submitting" style="width: 300px">确认提交
                </a-button>
            </a-form-item>
        </a-form>
        <a-modal
                title="《商户入驻协议》"
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
    import {Form, Input, Button, Row, Col, Select, Upload, Icon, Checkbox, message, Modal} from 'ant-design-vue'
    import http from '../../utils/http'
    import txMap from '../../utils/txMap'

    const dataUrl = {
        getCatalogueAll: '/api/category/index',
        sendNote: '/api/sms/send',
        fileUpload: '/api/file/upload',
        noteVerification: '/api/sms/verification',
        add: '/api/merchantAudit/insert',
        getAgreement: '/api/agreement/get'
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
            AModal: Modal
        },
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
            this.initMap()
            this.getCatalogueAll()
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
                industryData: [],
                catalogueData: [],
                shequData: require('../../assets/data/shequ'),
                imageUrlZZ: '',
                loadingZZ: false,
                imageUrlMT: '',
                loadingMT: false,
                shenqingImg: require('../../assets/image/shenqing/商户申请.png'),
                dingwei: require('../../assets/image/shenqing/dingwei.png'),
                checked: false,
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
            read() {
                this.readVisible = true
                http.post(dataUrl.getAgreement, {id: 2}).then(res => {
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
            zzUpload(file) {
                if (file.size > 1048576) {
                    message.warning('上传文件过大，请控制在1M以内')
                    return
                }
                if (this.$store.state.user) {
                    this.loadingZZ = true
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('userId', this.$store.state.user.id)
                    http.postFile(dataUrl.fileUpload, formData).then(res => {
                        if (res.code == 0) {
                            this.imageUrlZZ = res.data.src
                            this.loadingZZ = false
                        } else {
                            message.warning(res.msg)
                        }
                    })
                } else {
                    message.warning('用户信息异常，请重新登录')
                }
                return false
            },
            mtUpload(file) {
                if (file.size > 1048576) {
                    message.warning('上传文件过大，请控制在1M以内')
                    return
                }
                if (this.$store.state.user) {
                    this.loadingMT = true
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('userId', this.$store.state.user.id)
                    http.postFile(dataUrl.fileUpload, formData).then(res => {
                        if (res.code == 0) {
                            this.imageUrlMT = res.data.src
                            this.loadingMT = false
                        } else {
                            message.warning(res.msg)
                        }
                    })
                } else {
                    message.warning('用户信息异常，请重新登录')
                }
                return false
            },
            sendNote() {
                let phone = this.form.getFieldValue('phone')
                let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                if (!reg.test(phone)) {
                    message.warning('请输入有效的手机号码')
                    return
                }
                http.post(dataUrl.sendNote, {phoneNumbers: phone}).then(res => {
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
            checkedChange(e) {
                this.checked = e.target.checked
            },
            getCatalogueAll() {
                http.post(dataUrl.getCatalogueAll, {}).then(res => {
                    let data = new Array()
                    if (res.code == 0) {
                        if (res.data instanceof Array) {
                            res.data.forEach(e => {
                                if (e.parentId == 0) {
                                    data.push(e)
                                }
                            })
                            this.industryData = data
                        }
                    }
                })
            },
            catalogueChange(e) {
                http.post(dataUrl.getCatalogueAll, {
                    parentId: e.key
                }).then(res => {
                    let data = new Array()
                    if (res.code == 0) {
                        if (res.data instanceof Array) {
                            res.data.forEach(e => {
                                data.push(e)
                            })
                            this.catalogueData = data
                        }
                    }
                })
            },
            submitData(values) {
                http.post(dataUrl.add, {
                    userId: this.$store.state.user.id,
                    name: values.name,
                    licenseName: values.licenseName,
                    introduction: values.introduction,
                    personCharge: values.personCharge,
                    phone: values.phone,
                    account: values.account,
                    unicode: values.unicode,
                    openingBank: values.openingBank,
                    accountName: values.accountName,
                    businessLicense: this.imageUrlZZ,
                    doorPhoto: this.imageUrlMT,
                    address: values.address,
                    community: values.community.key,
                    longitude: this.mapData.longitude,
                    latitude: this.mapData.latitude,
                    categoryId: values.catalogueId.key,
                    categoryParentId: values.categoryParentId.key
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
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            if (this.mapData.longitude && this.mapData.latitude) {
                                if (this.imageUrlZZ) {
                                    if (this.imageUrlMT) {
                                        if (this.checked) {
                                            if (this.yzNote) {
                                                let authCode = this.form.getFieldValue('authCode')
                                                let regAuthCode = /^[0-9]{6}$/
                                                if (!regAuthCode.test(authCode)) {
                                                    message.warning('请输入有效的验证码')
                                                    return
                                                }
                                                http.post(dataUrl.noteVerification, {
                                                    code: authCode
                                                }).then(res => {
                                                    if (res.code == 0) {
                                                        this.submitData(values)
                                                    } else {
                                                        message.warning(res.msg)
                                                    }
                                                })
                                            } else {
                                                this.submitData(values)
                                            }
                                        } else {
                                            message.warning('请先阅读并同意用户协议')
                                        }
                                    } else {
                                        message.warning('请先上传门口照')
                                    }
                                } else {
                                    message.warning('请先上传执照图片')
                                }
                            } else {
                                message.warning('请先在地图上选择商铺地址')
                            }
                        }
                    },
                )
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