<template>
  <div class="publication">
    <div class="publication__header">
      <div class="profil__container-avatar">
                    <img v-if="author.urlAvatar != null" :src="author.urlAvatar" class="avatarAuthor" alt="avatar de l'utilisateur" /> 
                    <img v-else src="@/assets/svg/logo.svg" class="avatarAuthor" alt="avatar de l'utilisateur" /> 
                </div>
      <div>
        <em>{{author.name}}</em> le <em>{{dateCreation}}</em>
      </div>
    </div>
    <div class="publication__content">
      <h2><router-link class="voir-publication" :to="{name: 'Publication', params: { idPublication: this.publication.idPublication }}" >{{publication.title}}</router-link></h2>
      <p>{{publication.content}}</p>
    </div>
    <div class="publication__illustration" v-if="publication.illustration">
      <img class="publication__illustration-img" :src="publication.illustration" alt="image lié à la publciation"/>
    </div>
    <div class="publication__footer">
      <router-link class="button" :to="{name: 'Publication', params: { idPublication: this.publication.idPublication }}" title="voir les commentaires">💬 {{nbr_commentaire}}</router-link> 
      <div class="moderator" v-if="author.idUser==this.user.idUser || this.user.isModerator">
        <button class="button" @click="deletePublication">Supprimer</button>
        <router-link class="button" :to="{name:'EditPublication', params:{ idPublication: this.publication.idPublication }}" title="modifier la publication">Modifier</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import Cookie from 'js-cookie';
export default {
  data(){
    return{
      author: this.publication.author
    }
  },
  computed:{
    ...mapState(['user']),
    dateCreation(){
      let date_timestamp = this.publication.creationDate;
      var date = new Date( date_timestamp * 1);
      
      var formattedTime = date.toLocaleDateString();

      return formattedTime;
    },
    nbr_commentaire(){
      return (this.publication.replies)?this.publication.replies.length:0;
    }
  },
  props:{
    publication: {
      type: Object,
      required:true
    }
  },
  methods:{
    deletePublication:async function(){
      await fetch(
      "http://localhost:3000/api/publication/"+this.publication.idPublication,{
          method:"DELETE",
          headers:{
            "Content-Type":"application/json",
            "Authorization":'Bearer ' + Cookie.get('user_session')
          }
        }
       );
       this.$router.go();
    }
  }
}
</script>

<style lang="scss">
  @import "@/scss/_variables.scss";
  .publication{
    display:flex;
    flex-direction: column;
    overflow: hidden;
    padding: 5px;
    border: 1px solid rgba($text-color,.3);
    

    &__header{
      
      display:flex;
      flex-direction: row;
      align-items: center;

      div{
        margin-right:10px;
      }

      em{
        text-decoration: none;
        font-style:normal;
        font-weight: bold;
      }

      img{
        width:40px;
        height:40px;
        border-radius:40px;
        overflow:hidden;
      }
    }

    &__content{
      display:flex;
      flex-direction: column;
      align-items: stretch;
      width:95%;
      margin:auto;
      h2{
        border-bottom:1px solid $text-color;
        padding-left:2em;
        a{
          text-decoration:none;
          color:$text-color;

          &:visited{
            color:$text-color;
          }
          &:hover{
            color:$action-color;
          }
          
        }
        
      } 
    }

    &__illustration{
      display:flex;
      flex-direction: column;
      align-items: stretch;
      width:95%;
      margin:auto;
      border-top:1px solid $text-color;
      &-img{
        margin:5px auto;
        width:60%;
        object-fit: cover;
      }
    }

    &__footer{
      display:flex;
      min-width:110px;
      flex-direction: row;
      justify-content: flex-start;
      align-items: stretch;
      padding:5px;
      
      .moderator{
        width:20%;
        margin-left:25px;
        display:flex;
        flex-direction: row;

        justify-content: space-evenly;
      }
      .button{
        display:block;
        box-sizing: content-box;
        height:1.5rem;

        margin-top:5px;
        padding:2px 5px;
        border-radius:5px;
        border:1px solid $action-color;
        background-color:$action-color;
        color:$text-color;
        font-size:1rem;
        font-family:Arial;
        text-align: center;
        line-height: 1.5rem;
        text-decoration: none;
        &:hover{
            border:1px solid #e0898f;
            background-color: #e0898f; // 25 % lighter
        }
      }
    }
  }
</style>