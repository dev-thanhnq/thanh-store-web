import axios from 'axios'
import store from "../store";
import router from "../router";

const baseUrl = process.env.VUE_APP_BASE_URL;

export const apiAxios = axios.create({
    baseURL: `${baseUrl}/api`,
    headers: {
        post: {
            'Content-Type': 'application/json'
        }
    }
})

apiAxios.interceptors.request.use(config => {
    let token = store.state.auth.accessToken
    if (token) {
        config.headers.common['Authorization'] = `Bearer ${token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

apiAxios.interceptors.response.use(undefined, (error) => {
    if (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry && router.currentRoute.name !== 'Login') {
            store.commit('auth/updateLoginStatus', false)
            store.commit('auth/updateAuthUser', {})
            store.commit('auth/updateAccessToken', '')
            return router.push({ name: 'Login' })
        }
    }
    return Promise.reject(error);
})

export default {
    //download file excel
    dowloadExcelTemplate() {
        return apiAxios({
            method: 'get',
            url: '/products/template-import-file',
            responseType: 'blob',
        })
    },
    //lay du lieu profile
    getDataProfile() {
        return apiAxios({
            method: 'get',
            url: '/users',
        })
    },
    //update profile
    updateProfile(data) {
        return apiAxios({
            method: 'put',
            url: '/users/change-profile',
            data: data
        })
    },
    //update password
    changePassword(data) {
        return apiAxios({
            method: 'put',
            url: '/users/change-password',
            data: data
        })
    },
    //get data order  
    getDataOrder() {
        return apiAxios({
            method: 'get',
            url: '/reports',
        })
    },
    // get data cho cot thong ke doanh thu theo ngay
    getTotalValue() {
        return apiAxios({
            method: 'get',
            url: '/reports/get-order',
        })
    },
    //get data cho cot thong ke doanh thu theo thang
    getTotalValueMonth() {
        return apiAxios({
            method: 'get',
            url: '/reports/get-order-month',
        })
    },
    // crud customer
    getDataCustomer(params = null) {
        return apiAxios({
            method: 'get',
            url: '/customers',
            params: params,
        })
    },
    addNewCustomer(data) {
        return apiAxios({
            method: 'post',
            url: '/customers',
            data: data
        })
    },
    editCustomer(data) {
        return apiAxios({
            method: 'put',
            url: '/customers/' + data.id,
            data: data
        })
    },
    deleteCustomer(id) {
        return apiAxios({
            method: 'delete',
            url: '/customers/' + id,
        })
    },
    // crud auth user
    getAuthUser() {
        return apiAxios({
            method: 'get',
            url: '/auth/me'
        })
    },
    login(data) {
        return apiAxios({
            method: 'post',
            url: 'auth/login',
            data: data
        })
    },
    // crud product
    getDataProducts(params = null) {
        return apiAxios({
            method: 'get',
            url: '/products',
            params: params
        })
    },
    addProduct(data) {
        return apiAxios({
            method: 'post',
            url: '/products',
            data: data
        })
    },
    deleteProduct(id) {
        return apiAxios({
            method: 'delete',
            url: '/products/' + id,
        })
    },
    updateProduct(id, data) {
        return apiAxios({
            method: 'post',
            url: '/products/' + id,
            data: data
        })
    },
    // crud categories
    getDataCategories() {
        return apiAxios({
            method: 'get',
            url: '/categories/all',
        })
    },
    getDataCategoriesPaginate(params = null) {
        return apiAxios({
            method: 'get',
            url: '/categories',
            params: params
        })
    },
    addNewCategory(data) {
        return apiAxios({
            method: 'post',
            url: '/categories',
            data: data
        })
    },
    upadateCategory(id, data) {
        return apiAxios({
            method: 'put',
            url: '/categories/' + id,
            data: data
        })
    },
    deleteCategory(id) {
        return apiAxios({
            method: 'delete',
            url: '/categories/' + id,
        })
    },
    // crud user 
    getDataUser(params = null) {
        return apiAxios({
            method: 'get',
            url: '/users/list-staff',
            params: params
        })
    },
    searchUser(search) {
        return apiAxios({
            method: 'get',
            url: '/users/list-staff?q=' + search,
            search: search,
        })
    },
    addNewUser(data) {
        return apiAxios({
            method: 'post',
            url: '/users/staff',
            data: data,
        })
    },
    editUser(data) {
        return apiAxios({
            method: 'put',
            url: '/users/' + data.id + '/staff',
            data: data,
        })
    },
    deleteUser(id) {
        return apiAxios({
            method: 'delete',
            url: '/users/' + id,
        })
    },
    resetPassword(data) {
        return apiAxios({
            method: 'put',
            url: '/users/' + data.id + '/reset-password',
            data: data
        })
    },
    // carts
    getDataCarts() {
        return apiAxios({
            method: 'get',
            url: '/carts',
        })
    },
    addCart(id) {
        return apiAxios({
            method: 'post',
            url: '/carts/products/' + id
        })
    },
    addUpdateCart(id, data) {
        return apiAxios({
            method: 'put',
            url: '/carts/products/' + id,
            data: data
        })
    },
    deleteCart(id) {
        return apiAxios({
            method: 'delete',
            url: '/carts/' + id,
        })
    },
    storeOrder(data) {
        return apiAxios({
            method: 'post',
            url: '/carts/store-order',
            data: data
        })
    },
    // lay du lieu theo bo loc time 
    dateTime(params) {
        return apiAxios({
            method: 'get',
            url: '/orders',
            params: params
        })
    },
    getDataOrders(params = null) {
        return apiAxios({
            method: 'get',
            url: '/orders',
            params: params
        })
    },
    changeStatusOrders(id, data) {
        return apiAxios({
            method: 'put',
            url: '/orders/change-status/' + id,
            data: data
        })
    },
    //File
    importProductExcel(data) {
        return apiAxios({
            method: 'post',
            url: '/products/import',
            data: data
        })
    },
    changeStatusMultiOrders(data) {
        return apiAxios({
            method: 'post',
            url: '/orders/change-status-all',
            data: data
        })
    },
    getOrder(id) {
        return apiAxios({
            method: 'get',
            url: '/orders/' + id,
        })
    },
    //expor Excell order
    exportExel(params = null) {
        return apiAxios({
            method: 'get',
            url: 'orders/export-excel',
            responseType: 'blob',
            params: params
        })
    },
    getProduct(id) {
        return apiAxios({
            method: 'get',
            url: '/products/' + id,
        })
    },
    importProduct(id, data) {
        return apiAxios({
            method: 'post',
            url: '/products/import-product/' + id,
            data: data
        })
    },
    //roles
    getDataRoles(params) {
        return apiAxios({
            method: 'get',
            url: '/roles/',
            params: params
        })
    },
    getRoleAll() {
        return apiAxios({
            method: 'get',
            url: '/roles/get-roles'
        })
    },
    addRole(data) {
        return apiAxios({
            method: 'post',
            url: '/roles/',
            data: data
        })
    },
    updateRole(id, data) {
        return apiAxios({
            method: 'put',
            url: '/roles/' + id,
            data: data
        })
    },
    deleteRole(id) {
        return apiAxios({
            method: 'delete',
            url: '/roles/' + id,
        })
    },
    getPermissions() {
        return apiAxios({
            method: 'get',
            url: '/permissions'
        })
    },
    getRoleDetail(id) {
        return apiAxios({
            method: 'get',
            url: '/roles/' + id,
        })
    },
    addPermissionForRole(id, data) {
        return apiAxios({
            method: 'post',
            url: 'roles/' + id + '/add-permission',
            data: data
        })
    },
    removePermissionForRole(id, data) {
        return apiAxios({
            method: 'post',
            url: 'roles/' + id + '/remove-permission',
            data: data
        })
    },
}