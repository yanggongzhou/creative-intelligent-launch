import Vue from 'vue';
import Vuex from 'vuex';

import playtime from './modules/playtime'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    playtime,
  }
})

