<template>
    <a-config-provider :locale="locale">
        <router-view/>
    </a-config-provider>
</template>

<script>
    import {Button, ConfigProvider} from 'ant-design-vue'
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
    import http from '../../utils/http'

    const dataUrl = {
        getDomain: '/api/systemConfig/get'
    }

    export default {
        components: {
            AConfigProvider: ConfigProvider,
            AButton: Button,
        },
        name: "Main",
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        created() {
            /**
             * 保存当前store信息到localStorage-保证页面刷新store不刷新
             */
            sessionStorage.getItem('userStore') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(sessionStorage.getItem('userStore'))))
            window.addEventListener('beforeunload', () => {
                sessionStorage.setItem('userStore', JSON.stringify(this.$store.state))
            })
        },
        mounted() {
            this.getDomain()
        },
        data() {
            return {
                locale: zhCN,
            }
        },
        methods: {
            getDomain() {
                http.post(dataUrl.getDomain, {
                    type: 'websiteConfig',
                    key: 'realmName'
                }).then(res => {
                    if (res.code == 0) {
                        this.$store.dispatch('changeDomainNameFun', res.data.value)
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>