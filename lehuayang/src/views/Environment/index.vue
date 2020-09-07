<template>
    <div style="padding: 22px">
        <a-skeleton active avatar :paragraph="{rows: 2}" :loading="loading">
            <div>
                <a-row :key="index" v-for="item,index in ambientPhoto" style="margin-bottom: 20px">
                    <a-card hoverable style="border-radius: 8px">
                        <img style="padding: 10px"
                             alt="环境照"
                             :src="item.src"
                             slot="cover"
                        />
                        <a-card-meta>
                            <template slot="title">
                                <a-col :span="12">
                                    <a-tag color="#00B7EE" style="height: 32px;line-height: 30px">
                                        排序
                                        <a-input style="width: 25px;height: 25px;padding: 3px" min="1"
                                                 :defaultValue="item.sort"
                                                 @change="sortChange($event,item.id)"></a-input>
                                    </a-tag>
                                </a-col>
                                <a-col :span="12" style="text-align: right">
                                    <a-button @click="deleteData(item.id)">删除</a-button>
                                </a-col>
                            </template>
                        </a-card-meta>
                    </a-card>
                </a-row>
                <a-row style="margin-bottom: 20px;text-align: center" v-show="ambientPhoto.length==0">暂无数据</a-row>
            </div>
        </a-skeleton>
        <a-row style="text-align: center">
            <a-upload
                    :showUploadList="false"
                    :beforeUpload="add"
            >
                <a-button style="width: 100px;margin-top: 42px">
                    <a-icon type="loading" v-show="uploadLoading"/>
                    添加
                </a-button>
            </a-upload>
        </a-row>
    </div>
</template>

<script>
    import {Row, Card, Button, Skeleton, Col, Input, Tag, Upload, Icon, message} from 'ant-design-vue'
    import http from '../../utils/http'
    import debounce from 'lodash/debounce'

    const dataUrl = {
        getUserData: '/api/user/index',
        getPhotoData: '/api/photo/list',
        uploadPhoto: '/api/file/upload',
        insertPhotoData: '/api/photo/insert',
        updatePhotoData: '/api/photo/update',
        updateMerchantData: '/api/merchant/update',
        deletePhotoData: '/api/photo/delete'
    }
    export default {
        components: {
            ARow: Row,
            ACard: Card,
            ACardMeta: Card.Meta,
            AButton: Button,
            ASkeleton: Skeleton,
            ACol: Col,
            AInput: Input,
            ATag: Tag,
            AUpload: Upload,
            AIcon: Icon
        },
        name: "environment",
        mounted() {
            this.loader()
        },
        data() {
            this.sortChange = debounce(this.sortChange, 500)
            return {
                ambientPhoto: [],
                loading: true,
                uploadLoading: false,
                photoIdStr: ''
            }
        },
        methods: {
            loader() {
                this.loading = true
                http.post(dataUrl.getUserData, {
                    phone: this.$store.state.user.phone
                }).then(res => {
                    if (res.code == 0) {
                        this.$store.dispatch('addUserFun', res.data.user)
                        this.$store.dispatch('addMerchantFun', res.data.merchant)
                        if (res.data.merchant) {
                            let photoIdStr = res.data.merchant.ambientPhoto
                            this.photoIdStr = photoIdStr
                            if (photoIdStr) {
                                let photoData = new Array()
                                http.post(dataUrl.getPhotoData, photoIdStr, true, true, true).then(res => {
                                    if (res.code == 0) {
                                        if (res.data instanceof Array) {
                                            photoData = JSON.parse(JSON.stringify(res.data))
                                            photoData.forEach((item, index, arr) => {
                                                arr[index].src = this.$store.state.domainName + item.src
                                            })
                                            this.ambientPhoto = this.sortData(photoData)
                                            this.loading = false
                                        }
                                    }
                                })
                            } else {
                                this.ambientPhoto = new Array()
                                this.loading = false
                            }
                        }
                    }
                })
            },
            sortData(data) {
                if (data instanceof Array) {
                    for (let i = 0; i < data.length - 1; i++) {
                        for (let j = 0; j < data.length - i - 1; j++) {
                            if (data[j].sort > data[j + 1].sort) {
                                let swap = data[j];
                                data[j] = data[j + 1];
                                data[j + 1] = swap;
                            }
                        }
                    }
                }
                return data
            },
            sortChange(event, id) {
                if (isNaN(event.target.value) || event.target.value <= 0) {
                    message.warning('请输入大于0的数字')
                }
                http.post(dataUrl.updatePhotoData, {
                    id: id,
                    sort: event.target.value
                }).then(res => {
                    if (res.code == 0) {
                        message.success(res.msg)
                        this.loader()
                    } else {
                        message.warning(res.msg)
                    }
                })
            },
            deleteData(id) {
                http.post(dataUrl.deletePhotoData, {
                    id: id
                }).then(res => {
                    if (res.code == 0) {
                        if (this.photoIdStr) {
                            let ids = new Array()
                            ids = this.photoIdStr.split(',')
                            if (ids instanceof Array) {
                                let deleteIndex = null
                                ids.forEach((item, index) => {
                                    if (item == id) {
                                        deleteIndex = index
                                        return
                                    }
                                })
                                if (deleteIndex != null) {
                                    ids.splice(deleteIndex, 1)
                                    let idStr = ''
                                    ids.forEach(e => {
                                        if (idStr) {
                                            idStr = idStr + ',' + e
                                        } else {
                                            idStr = e
                                        }
                                    })
                                    let merchant = JSON.parse(JSON.stringify(this.$store.state.merchant))
                                    merchant.ambientPhoto = idStr
                                    http.post(dataUrl.updateMerchantData, merchant).then(res => {
                                        if (res.code == 0) {
                                            message.success(res.msg)
                                            this.loader()
                                        } else {
                                            message.warning(res.msg)
                                        }
                                    })
                                } else {
                                    message.success(res.msg)
                                }
                            } else {
                                message.success(res.msg)
                            }
                        } else {
                            message.success(res.msg)
                        }
                    } else {
                        message.warning(res.msg)
                    }
                })
            },
            add(file) {
                this.uploadLoading = true
                if (file.size > 1048576) {
                    message.warning('上传文件过大，请控制在1M以内')
                    this.uploadLoading = false
                    return
                }
                if (this.$store.state.user) {
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('userId', this.$store.state.user.id)
                    http.postFile(dataUrl.uploadPhoto, formData).then(res => {
                        if (res.code == 0) {
                            http.post(dataUrl.insertPhotoData, {
                                otherCategoryId: 1,
                                src: res.data.src,
                                sort: 1
                            }).then(res => {
                                if (res.code == 0) {
                                    if (this.photoIdStr) {
                                        this.photoIdStr = this.photoIdStr + ',' + res.data.id
                                    } else {
                                        this.photoIdStr = res.data.id
                                    }
                                    let merchant = JSON.parse(JSON.stringify(this.$store.state.merchant))
                                    merchant.ambientPhoto = this.photoIdStr
                                    http.post(dataUrl.updateMerchantData, merchant).then(res => {
                                        if (res.code == 0) {
                                            this.uploadLoading = false
                                            message.success(res.msg)
                                            this.loader()
                                        } else {
                                            this.uploadLoading = false
                                            message.warning(res.msg)
                                        }
                                    })
                                } else {
                                    this.uploadLoading = false
                                    message.warning(res.msg)
                                }
                            })
                        } else {
                            this.uploadLoading = false
                            message.warning(res.msg)
                        }
                    })
                } else {
                    this.uploadLoading = false
                }
                return false
            }
        }
    }
</script>

<style scoped>

</style>