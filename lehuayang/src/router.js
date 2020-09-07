import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from './views/Main/index'
import PersonalCenterSH from './views/PersonalCenterSH/index'
import StaffManagement from './views/StaffManagement/index'
import Attestation from './views/Attestation/index'
import Management from './views/Management/index'
import Environment from './views/Environment/index'
import CampaignList from './views/Campaign/List/index'
import CampaignEdit from './views/Campaign/Edit/index'
import Goods from './views/Goods/index'
import Login from './views/Login/index'
import GoodsAdd from './views/Goods/add'
import Apply from './views/Apply/index'
import Personal from './views/Personal/index'
import Card from './views/Card/index'
import Comment from './views/Comment/index'
import Statistics from './views/Statistics/index'
import ScanVerification from './views/ScanVerification/index'
import Home from './views/Home/home'
import Shop from './views/Shop/index'
import serchshop from './views/SerchShop/index'
import ShopDetail from './views/ShopDetail/index'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'main',
        component: Main,
        redirect: '/personal-center-sh',
        children: [
            {
                /**个人资料**/
                path: '/personal',
                name: 'personal',
                component: Personal,
                children: []
            },
            {
                /**卡券中心**/
                path: '/card',
                name: 'card',
                component: Card,
                children: []
            },
            {
                /**评论管理**/
                path: '/comment',
                name: 'comment',
                component: Comment,
                children: []
            },
            {
                /**个人中心-商户版**/
                path: '/personal-center-sh',
                name: 'personalCenterSH',
                component: PersonalCenterSH,
                children: []
            }, {
                /**商户申请**/
                path: '/apply',
                name: 'apply',
                component: Apply,
                children: []
            }, {
                /**商户认证**/
                path: '/attestation',
                name: 'attestation',
                component: Attestation,
                children: []
            }, {
                /**商户信息管理**/
                path: '/management',
                name: 'management',
                component: Management,
                children: []
            }, {
                /**环境图片管理**/
                path: '/environment',
                name: 'environment',
                component: Environment,
                children: []
            }, {
                /**核销统计**/
                path: '/2tatistics',
                name: '2tatistics',
                component: Statistics,
                children: []
            }, {
                /**营销活动管理**/
                path: '/campaign-list',
                name: 'campaignList',
                component: CampaignList,
                children: []
            }, {
                /**营销活动管理修改**/
                path: '/campaign-edit',
                name: 'campaignEdit',
                component: CampaignEdit,
                children: []
            }, {
                /**员工管理**/
                path: '/staff-management',
                name: 'staffManagement',
                component: StaffManagement,
                children: []
            }, {
                /** 商品管理 **/
                path: '/goods',
                name: 'goods',
                component: Goods,
                children: []
            }, {
                /** 商品添加 **/
                path: '/goods-add',
                name: 'goodsadd',
                component: GoodsAdd,
                children: []
            }, {
                /** 商品添加 **/
                path: '/scan-verification',
                name: 'scanVerification',
                component: ScanVerification,
                children: []
            },
            {
                /** 商品添加 **/
                path: '/shop',
                name: 'shop',
                component: Shop,
                children: []
            },
            {
                /** 商品添加 **/
                path: '/shopDetail',
                name: 'shopdetail',
                component: ShopDetail,
                children: []
            },
            ],
    },
    {
        /**用户登录**/
        path: '/login',
        name: 'login',
        component: Login,
        children: []
    },
    {
        /**首页*/
        path: '/home',
        name: 'home',
        component: Home,
        children: []
    },
    {
        /**首页*/
        path: '/serchshop',
        name: 'serchshop',
        component: serchshop,
        children: []
    }
]

const router = new VueRouter({
    routes
})

export default router