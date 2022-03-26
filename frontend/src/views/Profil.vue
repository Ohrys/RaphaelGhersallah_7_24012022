<template>
  <div id="profil__container">
    <h1>Mon Profil</h1>
        <div class="profil__container-avatar">
          <img v-if="user.urlAvatar != null" :src="user.urlAvatar" class="avatarAuthor" alt="avatar de l'utilisateur" /> 
          <img v-else src="@/assets/svg/logo.svg" class="avatarAuthor" alt="avatar de l'utilisateur" /> 
        </div>
        <h2 class="profil__container-name">
          {{user.name}} - {{user.email}}
        </h2>
        <button @click="editProfil">Modifier mon profil</button>
        <form class="profil__container-form" :style="{display: computedDisplay}" @submit.prevent="sendModifProfil">
        <div>
            <label for="image"> Modifier votre Avatar</label>
            <input id="image" ref="image" name="image" type="file" placeholder="Nom" @change="upload">
        </div>
        <div>
            <label for="name"> Modifier votre Nom</label>
            <input id="name" name="name" v-model.trim="name" placeholder="Nom">
        </div>
        <div>
            <label for="email">Modifier votre E-mail</label>
            <input id="email" name="email" v-model.trim="email" placeholder="Email">
        </div>
        <div class="profil__container-form-send">
          <div>
				<input type="submit" value="Valider">
          </div>
			<div>
				<button @click="deleteProfil">Supprimer mon Profil</button>
			</div>
		</div>
        </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Cookie from 'js-cookie';
export default {
  computed:{
    ...mapState(['user']),
    computedDisplay: function(){
      return this.display;
    }
  },
  data(){
    return{
		display:"none",
		name:"",
		email:"",
		image:null
    }
  },
  created(){
		this.setUser();
  },
  methods:{	
	...mapActions(['setUser','unsetUser']),
	upload(){
		this.image = this.$refs.image.files[0];
		console.log(this.image);
	},
    editProfil: function(){
		this.display="flex"
    },
	sendModifProfil: async function(){
		/* const name = (this.name)?this.name:this.user.name;
		const email = (this.email)?this.email:this.user.email;*/
		const formData = new FormData();
		if(this.image !==null || ""){
			formData.append("image", this.image, this.image.filename);
			formData.append("name", (this.name)?this.name:this.user.name);
			formData.append("email", (this.email)?this.email:this.user.email);
		}else{
			formData.append("name", (this.name)?this.name:this.user.name);
			formData.append("email", (this.email)?this.email:this.user.email);
		}
		/* const isModerator = this.user.isModerator; */
		const idUser = this.user.idUser;

		
		const res = await fetch(
			"http://localhost:3000/api/user/"+idUser+"/modify",
			{
				method:"PUT",
				headers:{
					"Authorization":'Bearer ' + Cookie.get('user_session')
				},
				body:formData
			}
		);
		const data = await res.json();
		if(data.status == 1){
			console.log(data.user);
			this.setUser();
			this.$router.push({name:'Home'})   
		}
			
	},
	deleteProfil:async function(){
		const idUser = this.user.idUser;
		const res = await fetch(
			"http://localhost:3000/api/user/"+idUser+"/delete",
			{
				method:"DELETE",
				headers:{
					"Content-Type":"application/json",
					"Authorization":'Bearer ' + Cookie.get('user_session')
				},
				body:JSON.stringify({
					idUser
				})
			}
		);
		const data = await res.json();
		if(data.status == 1){
			this.unsetUser(data.user);
			this.$router.push({name:'Home'})  
		} 
	}
  }
  
}
</script>

<style lang="scss">
@import "@/scss/_variables.scss";
#profil__container{
	display:flex;
	flex-direction:column;
	align-items: center;

	button{
		min-width:375px;
		border:0px solid black;
		margin:10px auto;
		
		max-width:590px;
		font-size:1.5rem;
		background-color:$text-color;
		color:$bg-color;

		&:hover{
			color:rgba($bg-color,.5);
			box-shadow: 1px 1px 5px black;
		}
		}

	.profil__container{

		&-avatar{

			img{
				width:200px;
				height:200px;
				border-radius:200px;
			}
		}

		&-form{
			font-size: 1.2rem;
			width:50%;
			display:flex;
			flex-direction:column;
			align-items: stretch;


			div{
				display:flex;
				flex-direction: column;

				input{
					width:95%;
					height:1.5rem;
					margin-bottom:10px;

					&[type="submit"]{
						background-color:$action-color;
						color:$bg-color;
						border:1px solid $action-color;
						margin:auto;
						width:50%;
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
}
</style>