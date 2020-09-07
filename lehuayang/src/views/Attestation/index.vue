<template>
    <a-form :form="form" style="padding: 22px ">
        <a-form-item label="店铺名称">
            <a-input placeholder="商户招牌信息，如黄焖鸡米饭（XX店）"
                     v-decorator="['name',{ initialValue:formData.name,rules: [{ required: true, message: '请输入商户名称' }] }]"
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
        <!-- <a-form-item>
            <a-row>
                <a-col :span="17">
                    <a-input placeholder="验证码"
                             v-decorator="['authCode',{ initialValue:formData.authCode }]"

                    />
                </a-col>
                <a-col :span="5" style="margin-left: 8px">
                    <a-button type="primary" @click="sendNote">获取验证码</a-button>
                </a-col>
            </a-row>
        </a-form-item> -->
        <a-form-item label="行业">
            <a-row>
                <a-col :span="12">
                    <!-- <a-select :labelInValue="true" v-decorator="[
						  el        	'catalogueId',{
						          		initialValue:formData.categoryParentId,
						          		rules: [{ required: true, message: '请选择行业' }]
						          	}
						        ]"> -->
                        <!-- <a-select-option v-for="d in industryData" :key=d.id>{{d.name}}</a-select-option> -->

                    <a-select v-model="formData.categoryParentId" @change="(catalogueChange($event))" >

                        <a-select-option v-for="d in industryData" :key=d.id>{{d.name}}</a-select-option>

                      </a-select>  
                    <!-- </a-select> -->
                </a-col>
                <a-col :span="11" style="margin-left: 8px">
                    <!-- <a-select :labelInValue="true" v-decorator="[
						          	'catalogueId',{
						          		initialValue:formData.catalogueId,
						          		rules: [{ required: true, message: '请选择行业分类' }]
						          	}
						        ]" > -->
                        <a-select v-model="formData.categoryId" >
                            <a-select-option v-for="d in catalogueData" :key="d.id">{{d.name}}</a-select-option>
                        </a-select>
                </a-col>
            </a-row>
        </a-form-item>
        <a-form-item label="所属社区">
            <!-- <a-select :labelInValue="true" v-decorator="[
						          	'community',{
						          		initialValue:formData.community,
						          		rules: [{ required: true, message: '选择所属社区' }]
						          	}
						        ]"> -->
                <a-select v-model="formData.community" >
                <a-select-option v-for="d in shequData" :key="d.key">{{d.name}}</a-select-option>
            </a-select>
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
                        <img v-if="imageUrlZZ" :src="imageUrlZZ" alt="avatar"/>
                        <div v-else>
                            <a-icon :type="loadingZZ ? 'loading' : 'plus'"/>
                            <div class="ant-upload-text">点击上传</div>
                        </div>
                    </a-upload>
                </a-col>
                <a-col :span="16">
                    <span style="line-height: 105px;font-size: 13px;color: #838383">店铺申请信息与营业执照信息一致</span>
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
                        <img v-if="imageUrlMT" :src="imageUrlMT" alt="avatar"/>
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

        <div v-show="formData.state==0" style="font-size: 16px;color: #3B3B3B;text-align:center;"><span>审核中</span></div>
        <div v-show="formData.state==1" style="font-size: 16px;color: #20CB78;text-align:center;"><span>审核通过</span>
        </div>
        <div v-show="formData.state==2" style="font-size: 16px;color: red;text-align:center;"><span>审核失败</span></div>
        <div>
            <a-row v-show="formData.state==2">
                <a-col style="text-align: center"><span
                        style="font-weight: bold;font-size: 14px;line-height: 40px;"><a-checkbox
                        :checked="checked" @change="checkedChange"/><label style="margin-left: 5px">我同意《商户使用协议》</label></span>
                </a-col>
            </a-row>
        </div>

        <a-form-item :style="{marginTop:'8px',textAlign:'center'}" v-show="formData.state==2">
            <a-button type="primary" @click="handleSubmit" :loading="submitting" style="width: 300px">确认提交</a-button>
        </a-form-item>
    </a-form>
</template>


<script>
    import {Form, Input, Button, Row, Col, Select, Upload, Icon, Checkbox, message} from 'ant-design-vue'
    import http from '../../utils/http'
    import txMap from '../../utils/txMap'

    const dataUrl = {
        getData: '/api/merchantAudit/index',
        insert: '/api/merchantAudit/insert',
        fileUpload: '/api/file/upload',
        getCatalogueAll: '/api/category/index',
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
            ACheckbox: Checkbox
        },
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
            this.loader();
            this.initMap()
            this.getCatalogueAll()

        },
        name: "attestation",
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
                industryData: [],
            }
        },
        methods: {
            initMap() {
                this.mapData.map = txMap.addMap("map", 30.67, 104.07, 8)
                txMap.addMarker(this.mapData)
            },
            getMyLocation() {
                txMap.getMyLocation(this.mapData)
            },
            loader() {
                this.loading = true
                http.post(dataUrl.getData, this.$store.state.user ? {userId: this.$store.state.user.id} : {}).then(res => {
                    if (res.code == 0) {
                        this.formData = {
                            name: res.data.name,
                            licenseName: res.data.licenseName,
                            unicode: res.data.unicode,
                            personCharge: res.data.personCharge,
                            phone: res.data.phone,
                            introduction: res.data.introduction,
                            businessLicense: res.data.businessLicense,
                            doorPhoto: res.data.doorPhoto,
                            state: res.data.state,
                            catalogueId: res.data.catalogueId,
                            categoryParentId: res.data.categoryParentId,
                            community:res.data.community
                        }
                        this.imageUrlZZ = res.data.businessLicense;
                        this.imageUrlMT = res.data.doorPhoto;
                          http.post(dataUrl.getCatalogueAll, {
                                parentId: res.data.categoryParentId
                            }).then(res2 => {
            
 
                                let data = new Array()
                                if (res.code == 0) {
                                    if (res2.data instanceof Array) {
                                        res2.data.forEach(e => {
                                            data.push(e)
                                        })
                                        this.catalogueData = data
                                        this.formData.categoryId = res.data.categoryId;
                                    }
                                } 
                            })

                    } else {
                        message.warning(res.msg)
                    }
                }).then(() => {
                    this.loading = false
                })
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
                            this.imageUrlZZ = this.urlPrefix + res.data.src
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
                            this.imageUrlMT = this.urlPrefix + res.data.src
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
            handleSubmit() {
                if (this.checked) {
                    if (this.mapData.longitude && this.mapData.latitude) {
                        if (this.imageUrlZZ) {
                            if (this.imageUrlMT) {
                                this.form.validateFields(
                                    (err, values) => {
                                        if (!err) {
                                            http.post(dataUrl.insert, {
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
                                                    this.formData = {
                                                        userId: this.$store.state.user.id,
                                                        name: res.data.name,
                                                        licenseName: res.data.licenseName,
                                                        introduction: res.data.introduction,
                                                        personCharge: res.data.personCharge,
                                                        phone: res.data.phone,
                                                        account: res.data.account,
                                                        unicode: res.data.unicode,
                                                        openingBank: res.data.openingBank,
                                                        accountName: res.data.accountName,
                                                        businessLicense: res.data.imageUrlZZ,
                                                        doorPhoto: res.data.imageUrlMT,
                                                        address: res.data.address,
                                                        community: res.data.community.key,
                                                        longitude: res.data.longitude,
                                                        latitude: res.data.latitude,
                                                        categoryId: res.data.catalogueId.key,
                                                        categoryParentId: res.data.categoryParentId.key
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
                                message.warning('请先上传门口照')
                            }
                        } else {
                            message.warning('请先上传执照图片')
                        }
                    } else {
                        message.warning('请先在地图上选择商铺地址')
                    }
                } else {
                    message.warning('请先阅读并同意用户协议')
                }
            }
        },
    }

</script>

<style scoped>
    .ant-form-item {
        margin-bottom: 0;
    }

    .ant-form-item-label {
        text-align: left;
    }

    .span {
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
</style>
