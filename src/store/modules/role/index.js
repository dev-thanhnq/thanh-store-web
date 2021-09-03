
export default {
  namespaced: true,
  state: {
    role: [],
  },
  getters: {
    //
  },
  mutations: {
    updateRoleDetail (state, role) {
      state.role = role
    },
  },
}