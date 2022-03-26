<template>
<HomeLogged v-if="isConnected"/>
<div class="connexion-template" v-else>
    <figure class="presentation-container">
        <img src="@/assets/svg/logo_name_below.svg"/>
        <figcaption>Spécialisé dans la grande distribution, nous vous proposons ce réseau social interne.<br/> Connectez-vous pour en profiter.</figcaption>
    </figure>

    <div class="option-container">
        <router-link to="/register" class="option-container__primary-action" title="S'inscrire">S'inscrire</router-link>
        <p>ou</p>
        <router-link to="/login" class="option-container__secondary-action" title="Se connecter">Se connecter</router-link>
    </div>
</div>
</template>

<script>
// @ is an alias to /src
import HomeLogged from '@/views/HomeLogged.vue'
import {mapGetters} from 'vuex'

export default {
  name: 'Home',
  components: {
    HomeLogged,
  },
  computed:{
    ...mapGetters(['isConnected'])
  }
}
</script>

<style lang="scss">
  @import "@/scss/_variables.scss";

.connexion-template{
	display:flex;
	flex-direction: column;
	align-items: center;

	.presentation-container{
		display:flex;
		flex-direction: column;
		align-items: center;
		width:100%;

		img{
			width:95%;
			max-width:950px;
			max-height:500px;
			object-fit: cover;
			object-position:center;
		}

		figcaption{
			text-align: center;
			font-size: 1.2rem;
		}
	}
	.option-container{
		min-width:375px;
		max-width:590px;
		font-size:1.5rem;
		display:flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;

		a{
			border-radius: 5px;
			box-shadow: 0px 0px 5px rgba(0,0,0,.5);
			padding:5px 10px;
			text-decoration:none;
			display:block;
			word-wrap:no-wrap;
		}

		&__primary-action{
			background-color:$action-color;
			color:$text-color;
		}

		&__secondary-action{
			background-color:$text-color;
			color:$bg-color;
		}
	}
}




</style>