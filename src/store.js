import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    cevent: null,
  },

  mutations: {

    setEvent (state, cevent) {
      state.cevent = cevent;
    },

  },

  actions: {
  },

})
