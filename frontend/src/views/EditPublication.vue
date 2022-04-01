<template>
<div id="modify-publication__container">
<form class="profil__container-form" :style="{display: computedDisplay}" @submit.prevent="sendModifPublication">
        <div>
            <label for="name"> Modifier le titre :</label>
            <input id="title_publication" name="title_publication" type="text" v-model.trim="title_publication" :placeholder="this.publication.title"/>
        </div>
        <div>
            <label for="email">Modifier le contenu :</label>
            <textarea id="content_publication" name="content_publication" v-model.trim="content_publication" :placeholder="this.publication.content" rows="10" max="250"></textarea>
        </div>
        <div v-if="this.publication.illustration">
          <label for="image"> Modifier l'illustration :</label>
          <img class="illustration" :src="this.publication.illustration" alt="illustration de la publication" />
          <input id="image" ref="image" name="image" type="file" placeholder="Nom" @change="upload">
        </div>
  <div class="profil__container-form-send">
    <div>
      <input type="submit" value="Valider">
    </div>
  </div>
</form>
</div>
</template>

<script>
import Cookie from 'js-cookie';
import { mapActions } from 'vuex';
export default {
    data(){
        return{
            idPublication:this.$route.params.idPublication,
            publication:null,
            title_publication:null,
            content_publication:null,
            image:null
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
            .then(publication => {this.publication = publication, this.content_publication = this.publication.content; this.title_publication = this.publication.title;})
    },
    methods:{
      ...mapActions(['setUser']),
      upload(){
        this.image = this.$refs.image.files[0];
        console.log(this.image);
      },
      async sendModifPublication(){
        const formData = new FormData();
        formData.append('title', this.title_publication);
        formData.append('content', this.content_publication);
        if(this.image !== null){
          formData.append('image', this.image);
        }

        await fetch(
          "http://localhost:3000/api/publication/"+this.idPublication,{
            method:"PUT",
            headers:{
              "Authorization":'Bearer ' + Cookie.get('user_session')
            },
            body:formData
          }).then(res => res.json())
          .then(data => {
            if(data.status == 1){
              this.$router.push('/');
            }
          })
      
      }
    }


}
</script>

<style lang="scss">
  @import "@/scss/_variables.scss";

  #modify-publication__container{
    border: 1px solid rgba($text-color,.3);
    box-sizing: border-box;
    padding:20px;
    width:90%;
    form{
      margin:auto;
     font-size: 1.2rem;
			width:100%;
			display:flex;
			flex-direction:column;
			align-items: stretch;


			div{
				display:flex;
				flex-direction: column;
        margin-top:5px;

        .illustration{
          object-fit: cover;
          width:20%;
        }

				input{
					width:100%;
					height:1.5rem;
					margin-bottom:10px;

					&[type="submit"]{
						background-color:$action-color;
						color:$bg-color;
						border:1px solid $action-color;
						margin:5px auto;
						width:60%;
						height:40px;
						font-size:1.3rem;

						&:hover{
							border:1px solid #e0898f;
							background-color: #e0898f; // 25 % lighter
							box-shadow: 1px 1px 5px black;
						}
					}
				}
      }
    }
  }
</style>