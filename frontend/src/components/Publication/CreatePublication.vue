<template>
  <div id="create-publication__container">
    <form @submit="sendPublication">
      <label for="title_publication">Titre : </label>
      <input id="title_publication" name="title_publication" type="text" v-model.trim="title_publication" placeholder="Mon Titre" required/>
      <label for="content_publication">Contenu :</label>
      <textarea id="content_publication" name="content_publication" v-model.trim="content_publication" placeholder="votre super texte ici" cols="50" rows="5" max="250"></textarea>
      <label for="illustration_publication">Attacher une image :</label>
      <input id="illustration_publication" ref="image" name="illustration_publication" type="file" @change="upload">
      <input type="submit" value="Envoyer"/>
    </form>
  </div>
</template>

<script>
import Cookie from 'js-cookie';
export default {
  data(){
    return {
      title_publication:"",
      content_publication:"",
      illustration_publication:null
    }
  },
  methods:{
    upload(){
      this.illustration_publication = this.$refs.image.files[0];
      console.log(this.image);
    },
    
    async sendPublication(){
      const formData = new FormData();
      formData.append('title',this.title_publication);
      formData.append('content',this.content_publication);
      formData.append('image',this.illustration_publication);
      try {
        await fetch(
        "http://localhost:3000/api/publication",{
          method:"POST",
          headers:{
            "Authorization":'Bearer ' + Cookie.get('user_session')
          },
          body:formData
        }
      ).then(res => res.json())
      .then(data => {
        if(data.status == 1){
          console.log(data.message)
          this.$router.push('/'); 
          
        } 
      })
      .catch(data => console.log(data))
      .catch(data => console.log(data))  
    } catch (error) {
     console.log(error);
    }
    }
  }
}
</script>

<style lang="scss">
  @import "@/scss/_variables.scss";

  #create-publication__container{
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