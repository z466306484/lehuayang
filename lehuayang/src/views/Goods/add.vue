<template>
<div>
<a-form :form="form" style="padding: 22px ">
    <a-form-item>
                <a-row>
                    <a-col :span="20">
                        <a-upload
                                name="avatar"
                                listType="picture-card"
                                class="avatar-uploader"
                                :showUploadList="false"
                                :beforeUpload="zzUpload"
                        >
                            <img style="width: 100%;height: 90px" v-if="imageUrlZZ" :src="urlPrefix+imageUrlZZ" alt="avatar"/>
                            <div v-else>
                                <a-icon :type="loadingZZ ? 'loading' : 'plus'"/>
                                <div class="ant-upload-text">点击上传</div>
                            </div>
                        </a-upload>
                    </a-col>
                </a-row>
    </a-form-item>
    <a-form-item label="商户简介" style="margin-top: 30px">
        <a-text-area placeholder="描述提供服务和特色服务等,夸大描述和虚假信息无法通过认证" :autoSize="{ minRows: 3, maxRows: 5 }"
                     v-decorator="['describe',{ initialValue:formData.describe,rules: [{ required: true, message: '请输入商品简介' },{min:1,max:25,message:'最多25个字'}]}]"
                />
    </a-form-item>

    <a-form-item label="商品价格">
                <a-input placeholder="商品价格"
                         v-decorator="['price',{ initialValue:formData.price,rules: [{ required: true, message: '请输入商品价格' }] }]"
                />
    </a-form-item>
    <a-form-item label="排序">
                <a-input placeholder="排序"
                         v-decorator="['sort',{ initialValue:formData.sort,rules: [{ required: true, message: '请输入排序' }] }]"
                />
    </a-form-item>

    <a-form-item :style="{marginTop:'8px',textAlign:'center'}">
                <a-button type="primary" @click="handleSubmit" :loading="submitting" style="width: 300px">确认提交
                </a-button>
    </a-form-item>
</a-form>
</div>
</template>
<script>

import {Form, Input, Button, Row, Col, Select, Upload, Icon, Checkbox, message, Modal} from 'ant-design-vue'
import http from '../../utils/http'

const dataUrl = {
        fileUpload: '/api/file/upload',
        add:'/api/commodity/insert'
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
        data() {
            return {
                labelCol: { span: 14 },
				wrapperCol: { span: 24 },
                formData:{},
                imageUrlZZ: '',
                loadingZZ: false,
                urlPrefix: this.$store.state.domainName,
                submitting: false,
      };
      
    },
    methods: {
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
            submitData(values) {
                http.post(dataUrl.add, {
                    userId: this.$store.state.user.id,
                    merchantId:this.$store.state.merchant.id,
                    img:this.imageUrlZZ,
                    describe:values.describe,
                    price:values.price,
                    sort:values.sort
                }).then(res => {
                    if (res.code == 0) {
                        message.success(res.msg)
                        this.$router.push({name: 'goods'})
                    } else {
                        message.warning(res.msg)
                    }
                })
            },


            handleSubmit() {
                        if (this.imageUrlZZ) {
                                 this.form.validateFields(
                                    (err, values) => {
                                        if (!err) {
                                            http.post(dataUrl.add, {
                                                userId: this.$store.state.user.id,
                                                merchantId:this.$store.state.merchant.id,
                                            }).then(res => {
                                                if (res.code == 0) {
                                                    this.submitData(values)
                                                    message.success(res.msg)
                                                } else {
                                                    message.warning(res.msg)
                                                }
                                            })
                                        }
                                    },
                                 )
                        } else {
                            message.warning('请先上传商品图片')
                        }
            }


        },
        name: "goodsadd",
}
</script>

<style scoped>
</style>