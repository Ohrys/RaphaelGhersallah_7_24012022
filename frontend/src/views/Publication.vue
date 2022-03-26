<template>
<div>
    <div class="publication__header">
      <div>
        <img v-if="publication.author.urlAvatar != null" :src="publication.author.urlAvatar" class="avatarAuthor" :alt="'avatar de '+ publication.author.name"/> 
        <img v-else src="@/assets/svg/logo.svg" class="avatarAuthor" :alt="'avatar de '+ publication.author.name"/> 
      </div>
      <div>
        <em>{{publication.author.name}}</em> le <em>{{dateCreation}}</em>
      </div>
    </div>
   <div class="publication">
    
    <div class="publication__content">
      <h2>{{publication.title}}</h2>
      <p>{{publication.content}}</p>
    </div>
    <div class="publication__illustration" v-if="publication.illustration">
      <img class="publication__illustration-img" :src="publication.illustration" alt="image lié à la publciation"/>
    </div>
  </div>
  <hr/>
  <div id="create-comment__container">
    <form @submit="sendComment">
      <label for="content-comment">Contenu :</label>
      <textarea id="content-comment" name="content-comment" v-model="content" placeholder="votre super texte ici" cols="50" rows="5" required></textarea>
      <input type="submit" value="Envoyer"/>
    </form>
  </div>
  <h2>Commentaires :</h2>
  <div id="comments__feed" v-if="comments.length != 0">
    <div class="comment-container" v-for="comment in comments" :key="comment.idReply">
      <comment-item  :comment="comment"></comment-item>
    </div>
  </div>
  <div id="comments__feed" v-else>
    Soyez le premier à poster ici ! 
  </div>
</div>
</template>

<script>
import Cookie from 'js-cookie';
import CommentItem from '@/components/Commentaire/CommentItem.vue'
import { mapActions } from 'vuex';
export default {
  components: {
    CommentItem
  },
    data(){
        return{
            idPublication:this.$route.params.idPublication,
            publication:null,
            content:null,
            comments:null
        }
    },
    created(){

            this.setUser();
            fetch(
                "http://localhost:3000/api/publication/"+this.idPublication,
                {
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":'Bearer ' + Cookie.get('user_session')
                    }
                }
            ).then(response => response.json())
            .then(publication => this.publication = publication)

            fetch(
              "http://localhost:3000/api/reply/"+this.idPublication,
              {
                method:"GET",
                headers:{
                  "Content-Type":"application/json",
                  "Authorization":'Bearer ' + Cookie.get('user_session')
                }
              }
            ).then(response => response.json())
            .then(comments => this.comments = comments)
    },
    computed:{
        dateCreation(){
            let date_timestamp = this.publication.creationDate;
            var date = new Date( date_timestamp * 1);
            
            var formattedTime = date.toLocaleDateString();

            return formattedTime;
        }
    },
    methods:{
      ...mapActions(['setUser']),
      sendComment: async function(){
      const{content}=this;
      const res = await fetch(
        "http://localhost:3000/api/reply",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization":'Bearer ' + Cookie.get('user_session')
          },
          body:JSON.stringify({
            idPublication:this.idPublication,
            content
          })
        }
      )
      const data = res.json();
      if(data.status == 1){
        this.$router.push('/'); 
      } 
      }
    }


}
</script>

<style lang="scss">
  @import "@/scss/_variables.scss";

  .publication__illustration-img{
        margin:5px auto;
        max-width:60%;
        object-fit: cover;
      }

  #comments__feed{
    min-height:50%;
  }

  #create-comment__container{
    border: 1px solid rgba($text-color,.3);
    box-sizing: border-box;
    padding:20px;
    width:90%;
    form{
      display:flex;
      flex-direction: column;
      

      input[type="submit"]{
        margin-top:5px;
        text-decoration:none;
        background-color:$action-color;
        color:$text-color;
        border:0px;
        width:8rem;
        height:2rem;
        border-radius: 10px;
        font-size:1.25rem;
        align-self: flex-end;
      }
    }
  }
</style>