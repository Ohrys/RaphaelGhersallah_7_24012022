<template>
    <aside id="user-menu__container">
        <header>
            <div class="profil__container">
                <div class="profil__container-avatar">
                    <img v-if="user.urlAvatar != null" :src="user.urlAvatar" class="avatarAuthor" alt="avatar de l'utilisateur" /> 
                    <img v-else src="@/assets/svg/logo.svg" class="avatarAuthor" alt="avatar de l'utilisateur" /> 
                </div>
                <div class="profil__container-name">
                    <em>{{user.name}}</em>
                </div>
            </div>    
            <router-link class="modify-profil" :to="{name: 'Profil'}" >Modifier votre Profil</router-link>
        </header>
        <section>

        </section>
        <footer>
            <a href="/" @click="unsetUser">Se déconnecter</a>
        </footer>
    </aside>
</template>

<script>
import {mapState,mapActions} from 'vuex'


export default {
    computed:{
        ...mapState(['user']),
    },
    methods:{
        ...mapActions(['unsetUser'])
    }
}
</script>

<style lang="scss">
@import "@/scss/_variables.scss";
#user-menu__container{
    width:20%;
    border-right:1px solid rgba($text-color,.3);
    
    
    header{
        display:flex;
        flex-direction:column;
        align-items: flex-start;
        .profil__container{
            display:flex;
            flex-direction: row;
            align-items: center;
            &-avatar{
                img{
                    object-fit: cover;
                    border-radius:75px;
                    width:75px;
                    height:75px;
                }
            }

            &-name{
                margin-left:20px;
                em{
                    text-decoration: none;
                    font-weight:bold;
                    font-style:initial;
                    font-size:2rem;
                }
            }

        }
        

        .modify-profil{
            align-self: center;
            display:block;
            background-color:$action-color;
            padding:5px;
            box-sizing:border-box;
            border-radius:5px;
            max-width:40%;
            
            color:$text-color;
            font-size:0.8rem;
            text-decoration:none;

        }
    }

    footer{

        position:absolute;
        bottom:10px;
        a{  
            align-self: center;
            display:block;
            background-color:$action-color;
            padding:5px;
            box-sizing:border-box;
            border-radius:5px;
            max-width:100%;
            
            color:$text-color;
            font-size:0.8rem;
            text-decoration:none;
            color:$text-color;
            font-size:1rem;
            text-decoration:none;
        }

    }
    
}
</style>