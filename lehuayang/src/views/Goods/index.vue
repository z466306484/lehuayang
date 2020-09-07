<template>
    <a-row>
        
        <a-col :xs="22" :sm="22" :md="22" :lg="12" :xl="12" :offset="1"  style="padding: 0px 0px 22px 0px">
            <a-checkbox-group @change="changeBox">
            <a-card :bordered="false" :bodyStyle="{padding:'5px'}" style="border-radius: 5px" :key="index" v-for="(item,index) in goodsData" data-id="item.id">
                <a-row>
                    <a-col :span="11">
                        <div style="background:#A5EAFF;width:100%;height:116pt;">
                            <img :src="urlPrefix+item.imgSrc" style="width:100%;height:116pt;">
                            <a-checkbox :checked="all" value="item.id" v-if="remove"></a-checkbox>
                        </div>
                    </a-col>
                    <a-col :span="11">
                        <p style="height:62pt;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 4;overflow: hidden;margin-bottom:0;margin-left:15%;">{{item.describe}}</p>
                        <div style="height:39pt"></div>
                        <p style="height:16pt;margin-bottom:0;font-weight:bold;float:right;"><img src="../../assets/image/Goods/jg.png" style="width:17pt;height:17pt;">价格:<span style="color:#E41313;">{{item.price}}</span>元</p>
                    </a-col>
                </a-row>
            </a-card>
            </a-checkbox-group>
        </a-col>
    <a-row>
                <a-col :span="10">
                </a-col>
                <a-col :span="6">
                    <a-button type="primary" @click="add">添加</a-button>
                </a-col>
                <a-col :span="6">
                    <a-button type="danger" @click="del">删除</a-button>
                </a-col>
            </a-row>
    </a-row>

</template>

<script>
    import {Button, List,Avatar,Card,Row,Col,Checkbox, message} from 'ant-design-vue'
    import http from '../../utils/http'


    const dataUrl = {
        getData: '/api/commodity/index',
        getDelete:'/api/commodity/delete',
        getAdd:'/api/commodity/update'
    }

    export default {
        components: {
            AButton: Button,
            AList:List,
            AListItem:List.Item,
            ARow:Row,
            ACol:Col,
            AAvatar:Avatar,
            ACard:Card,
            ACheckbox:Checkbox,
            ACheckboxGroup:Checkbox.Group
        },
        name: "goods",
        mounted() {
            this.loader()
        },
        data() {
            return {
                goodsData:[],
                urlPrefix: this.$store.state.domainName,
                // checkedList: defaultCheckedList,
                // indeterminate: true,
                // checkAll: false,
                // plainOptions,
                all:false,
                remove:false
            }
        },
        
        methods:{

            

            loader() {
                this.userName = sessionStorage.getItem('user') ? sessionStorage.getItem('user').nickname : '**********'
                this.storeName = sessionStorage.getItem('merchant') ? sessionStorage.getItem('merchant').name : '**********'

                
                http.post(dataUrl.getData, this.$store.state.merchant ? {merchantId: this.$store.state.merchant.id} : {}).then(res => {
                    if (res.code == 0) {
                        let data = new Array()
                        if (res.data instanceof Array) {
                            res.data.forEach(e => {
                                data.push({
                                    imgSrc: e.img,
                                    describe: e.describe,
                                    price: e.price
                                })
                            })
                        }
                        this.goodsData = data
                    }else{
                        message.warning(res.msg)
                    }
                })
            },
            add(){
                this.$router.push({ name: 'goodsadd' })
            },
            //删除
            del(){
                if(this.data.checklist.length > 0 && this.data.checklist.length <30){
                    http.post(dataUrl.getDelete,{
                        id:item
                    }.then(res=>{
                        if(res.code == 0 ){
                            message.success(res.msg)
                        }else{
                            message.warning(res.msg)
                        }
                    })
                    )
                }else{
                    message.warning(res.msg)
                }
            },
            changeBox:function(e){
                this.data.checklist=e.detail.value
                console.log(e.detail.value)
            },
            checkAll:function(e){
                this.data.checklist=[];
                if (!this.data.all) {
                    for(let i=0;i<this.data.list.length;i++){
                    this.data.checklist.push(this.data.list[i].id)
                }
            }
            console.log(this.data.checklist)
                this.setData({
                all:!this.data.all
                })
            },
            checkAll:function(e){
                this.data.checklist=[];
                if (!this.data.all) {
                    for(let i=0;i<this.data.list.length;i++){
                    this.data.checklist.push(this.data.list[i].id)
                    }
                }
                console.log(this.data.checklist)
                this.setData({
                all:!this.data.all
                })
        
            },




        }
    }
</script>

<style scoped>

</style>