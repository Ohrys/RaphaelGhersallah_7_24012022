import { createStore } from 'vuex'
import Cookie from 'js-cookie'

export default createStore({
  state: {
    user:""
  },
  getters:{
    isConnected: () => {
      if (Cookie.get('user_session')){
        return true;

      } else {
        return false;
      }
    },
  },
  mutations: {
    SET_USER(state, user=""){
      state.user = user;
    },
    UNSET_USER(state){
      state.user = "";
    }
  },
  actions: {
    async setUser(context){
      const res = await fetch("http://localhost:3000/api/user/",{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          "Authorization": 'Bearer ' + Cookie.get('user_session')
        }
      })
      const user = await res.json();
      console.log(user);
      context.commit('SET_USER', user);
    },
    unsetUser(context){
      context.commit('UNSET_USER');
      Cookie.remove('user_session');
    } 
  }
})
