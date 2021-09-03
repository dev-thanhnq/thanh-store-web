import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import auth from './modules/auth'
import home from './modules/home'
import role from './modules/role'

Vue.use(Vuex)

const store = new Vuex.Store({
    namespaced: true,
    modules: {
        auth,
        home,
        role,
    },
    plugins: [createPersistedState({ paths: ['auth'] })],
    state: {
        pageTitle: 'Tổng quan',
        cartSum: 0,
        sidebarIndex: "0",
    },
    mutations: {
        updateTitle(state, title) {
            state.pageTitle = title
        },
        sumCart(state, data) {
            state.cartSum = data
        },
        updateSideBar(state, index) {
            state.sidebarIndex = index
        }
    }
})

export default store