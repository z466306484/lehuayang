<template>
    <div style="padding: 22px">
        <a-row>
            <a-col :span="7" style="line-height: 30px;text-align: center"><span>选择类型：</span></a-col>
            <a-col :span="17">
                <a-select :labelInValue="true"
                          placeholder="选择活动类型"
                          style="width: 95%"
                          :defaultValue="typeSelect"
                          @change="typeChange">
                    <a-select-option v-for="d in types" :key="d.value">{{d.label}}</a-select-option>
                </a-select>
            </a-col>
        </a-row>
        <a-row style="margin-top: 10px">
            <div v-show="typeSelect.value == 'zk'">
                <a-row>
                    <a-col :span="7" style="text-align: center">
                        <a-select :labelInValue="true"
                                  style="width: 95%"
                                  @change="zkTypeChange"
                                  :defaultValue="zkData.type">
                            <a-select-option value="1">全场</a-select-option>
                            <a-select-option value="0">部分</a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="8" style="text-align: center;line-height: 30px">低至</a-col>
                    <a-col :span="9">
                        <a-input-number :defaultValue="zkData.discount" :max="9.9" :min="0.1" :precision="1" :step="0.1"
                                        @change="zkDiscount"
                                        style="width: 70%"/>
                        <label style="margin-left: 5px">折</label>
                    </a-col>
                </a-row>
            </div>
            <div v-show="typeSelect.value == 'mj'">
                <a-row>
                    <a-col :span="6" style="text-align: center">
                        <a-select :labelInValue="true"
                                  style="width: 95%"
                                  @change="mjTypeChange"
                                  :defaultValue="mjData.type">
                            <a-select-option value="1">全场</a-select-option>
                            <a-select-option value="0">部分</a-select-option>
                        </a-select>
                    </a-col>
                    <a-col :span="3" style="text-align: center;line-height: 30px"><label>满</label></a-col>
                    <a-col :span="6" style="text-align: center">
                        <a-input-number :defaultValue="mjData.full" :min="1"
                                        @change="mjFull"
                                        style="width: 90%"/>
                    </a-col>
                    <a-col :span="3" style="text-align: center;line-height: 30px"><label>减</label></a-col>
                    <a-col :span="6" style="text-align: center">
                        <a-input-number :defaultValue="mjData.subtract" :min="1"
                                        @change="mjSubtract"
                                        style="width: 90%"/>
                    </a-col>
                </a-row>
                <a-row style="font-size: 14px;margin-top: 30px">
                    <a-row>Tips:</a-row>
                    <a-row>最多创建5条</a-row>
                    <a-row>创建后请显示创建顺序，以创建时间排序</a-row>
                </a-row>
            </div>
            <div v-show="typeSelect.value == 'yl'">
                <a-row>
                    <a-input-text-area
                            :defaultValue="ylData.content"
                            :maxLength="15"
                            v-model="ylData.content"
                            placeholder="请输入不超过15字的活动描述"/>
                </a-row>
                <a-row style="font-size: 14px;margin-top: 30px">
                    <a-row>Tips:</a-row>
                    <a-row>请尽量用较少的文字描述活动内容</a-row>
                    <a-row>示例：</a-row>
                    <a-row>（1）进店送好礼</a-row>
                    <a-row>（2）买衣服送精品棉袜（适用于服饰店）</a-row>
                    <a-row>（3）买手机送精美外科（适用于手机店）</a-row>
                </a-row>
            </div>
        </a-row>
        <a-row style="text-align: center;margin-top: 100px">
            <a-button type="primary" style="width: 100px" @click="submit">确定</a-button>
        </a-row>
    </div>
</template>

<script>
    import {Row, Col, Select, Button, InputNumber, message, Input} from 'ant-design-vue'
    import commonUtil from '../../../utils/commonUtil'
    import http from '../../../utils/http'

    const dataUrl = {
        getUserData: '/api/user/index',
        updateData: '/api/merchant/update'
    }
    export default {
        components: {
            ARow: Row,
            ACol: Col,
            ASelect: Select,
            ASelectOption: Select.Option,
            AButton: Button,
            AInputNumber: InputNumber,
            AInputTextArea: Input.TextArea
        },
        name: "CampaignEdit",
        mounted() {
            this.loader()
        },
        data() {
            return {
                types: [
                    {value: 'zk', label: '折扣'},
                    {value: 'mj', label: '满减'},
                    {value: 'yl', label: '有礼'}
                ],
                typeSelect: this.$route.params.key ? this.$route.params.key : {value: 'zk', label: '折扣'},
                zkDatas: null,
                zkData: this.$route.params.data ? this.$route.params.data : {
                    type: {value: '1', label: '全场'},
                    discount: 7.5
                },
                mjDatas: null,
                mjData: this.$route.params.data ? this.$route.params.data : {
                    id: commonUtil.getUUID(),
                    type: {value: '1', label: '全场'},
                    full: 100,
                    subtract: 10

                },
                ylDatas: null,
                ylData: this.$route.params.data ? this.$route.params.data : {
                    content: ''
                }
            }
        },
        methods: {
            loader() {
                http.post(dataUrl.getUserData, {
                    phone: this.$store.state.user.phone
                }).then(res => {
                    if (res.code == 0) {
                        this.$store.dispatch('addUserFun', res.data.user)
                        this.$store.dispatch('addMerchantFun', res.data.merchant)
                        let merchant = res.data.merchant
                        this.zkDatas = null
                        this.mjDatas = new Array
                        this.ylDatas = null
                        if (merchant) {
                            if (merchant.type != null && merchant.discount != null && merchant.discount != 0) {
                                this.zkDatas = {
                                    type: merchant.type == '0' ? {value: '0', label: '部分'} : {value: '1', label: '全场'},
                                    discount: merchant.discount
                                }
                            }
                            if (merchant.reduce) {
                                let mj = JSON.parse(merchant.reduce)
                                if (mj instanceof Array) {
                                    this.mjDatas = mj
                                }
                            }
                            if (merchant.gift) {
                                this.ylDatas = JSON.parse(merchant.gift)
                            }
                        }
                    }
                })
            },
            typeChange(value) {
                this.typeSelect = {value: value.key, label: value.label}
            },
            zkTypeChange(value) {
                this.zkData.type = {value: value.key, label: value.label}
            },
            zkDiscount(value) {
                this.zkData.discount = value
            },
            mjTypeChange(value) {
                this.zkData.type = {value: value.key, label: value.label}
            },
            mjFull(value) {
                this.mjData.full = value
            },
            mjSubtract(value) {
                this.mjData.subtract = value
            },
            submit() {
                if (this.$store.state.merchant) {
                    let merchant = JSON.parse(JSON.stringify(this.$store.state.merchant))
                    if (this.typeSelect.value == 'zk') {
                        if (this.zkDatas != null && this.$route.params.key == null) {
                            message.warning('当前店铺已有折扣活动')
                            return
                        } else {
                            merchant.type = this.zkData.type.value
                            merchant.discount = this.zkData.discount
                        }
                    } else if (this.typeSelect.value == 'mj') {
                        let data = null
                        if (this.mjDatas && this.mjDatas instanceof Array) {
                            let flag = true
                            data = JSON.parse(JSON.stringify(this.mjDatas))
                            data.forEach((item, index, arr) => {
                                if (item.id == this.mjData.id) {
                                    arr[index] = this.mjData
                                    flag = false
                                    return
                                }
                            })
                            if (flag) {
                                if (data.length >= 5) {
                                    message.warning('当前满减活动已达上限！')
                                    return
                                }
                                data.push(this.mjData)
                            }
                        } else {
                            data = new Array()
                            data.push(this.mjData)
                        }
                        merchant.reduce = JSON.stringify(data)

                    } else if (this.typeSelect.value == 'yl') {
                        if (this.ylDatas != null && this.$route.params.key == null) {
                            message.warning('当前店铺已有有礼活动')
                            return
                        } else {
                            merchant.gift = JSON.stringify(this.ylData)
                        }
                    }
                    http.post(dataUrl.updateData, merchant).then(res => {
                        if (res.code == 0) {
                            message.success(res.msg)
                            this.$router.push({name: 'campaignList'})
                        } else {
                            message.warning(res.msg)
                        }
                    })
                } else {
                    message.warning('当前用户未绑定商铺')
                }
            }
        }
    }
</script>

<style scoped>

</style>