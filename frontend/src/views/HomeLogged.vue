<template>
<div id="home-logged__container">
  <UserMenu/>
  <div id="publications">
    <createPublication/>
    <div id="publications__feed" v-if="publications !== null">
      <div class="publication-container" v-for="publication in publications" :key="publication.idPublication">
        <publication-item  v-bind:publication="publication"></publication-item>
      </div>
    </div>
    <div v-else>
      Soyez le premier à poster ici ! 
    </div>
  </div>
</div>
</template>

<script>
import CreatePublication from '@/components/Publication/CreatePublication.vue';
import PublicationItem from '@/components/Publication/PublicationItem.vue';
import UserMenu from '@/components/UserMenu.vue';
import {mapActions} from 'vuex';
import Cookie from 'js-cookie'
export default {
  name: 'PublicationFeed',
  data(){
    return {
      publications:null
    }
  },
  components: {
    CreatePublication,
    UserMenu,
    PublicationItem
  },
  created(){
    this.getPublications()
    this.setUser()
  },
  methods:{
    ...mapActions(['unsetUser','setUser']),
    async getPublications(){
                const res = await fetch(
                    "http://localhost:3000/api/publication",
                    {
                        method:"GET",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":'Bearer ' + Cookie.get('user_session')
                        }
                    }
                );
                this.publications = await res.json();
                return this.publications;
            }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
#home-logged__container{
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  #publications{
      width:70%;
      height:100%;
      display:flex;
      flex-direction: column;
      align-items: center;
    &__feed{
      width:90%;
      display:flex;
      margin-top:5px;
      flex-direction: column;
      justify-items: stretch;
      flex-grow: 1;
      
    }
  
  }

}

</style>
