import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null,
        merchant: null,
        domainName: null,
    },
    mutations: {
        addUser(state, value) {
            state.user = value
        },
        addMerchant(state, value) {
            state.merchant = value
        },
        changeDomainName(state, value) {
            state.domainName = value
        }
    },
    actions: {
        addUserFun(context, value) {
            context.commit('addUser', value)
        },
        addMerchantFun(context, value) {
            context.commit('addMerchant', value)
        },
        changeDomainNameFun(context, value) {
            context.commit('changeDomainName', value)
        }
    },
    modules: {}
})
