<template>
<form @submit.prevent="login">
    <div class="presentation-container">
        <img src="@/assets/svg/logo_name_below.svg"/>
    </div>
    <div class="form">
        <div>
            <label for="email">E-mail : </label>
            <input id="email" name="email" v-model="email" placeholder="E-mail">
        </div>
        <div>
            <label for="password">Password : </label>
            <input id="password" type="password" name="password" v-model="password" placeholder="Mot de passe">
        </div>
        <div>
            <input type="submit" value="Se connecter">
        </div>
    </div>
</form>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import Cookie from 'js-cookie';
export default{
    name:"Login",
    data(){
        return{
            email:"",
            password:""
        }
    },
    computed:{
        ...mapGetters(['isConnected'])
    },
    methods:{
        ...mapActions(['setUser']),
        async login(){
            const {email, password}=this;
            const res = await fetch(
                "http://localhost:3000/api/user/login",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        email,
                        password
                    })
                }
            );
            const data = await res.json();
            if(data.status == 1){
                Cookie.set('user_session',data.jwt_token);
                this.setUser();
                this.$router.push({name:'Home'})
            }
        }
    }
}
</script>

<style lang="scss">
    @import "@/scss/_variables.scss";

.form{
        font-size: 1.25rem;
        width:75%;
        max-width: 720px;
        display:flex;
        flex-direction: column;
        align-items: stretch;
        
        
        em{
            color:$action-color;
        }

        div{
            margin:0 4%;
            display:flex;
            flex-direction: column;

            label{
                padding-left:15px;
            }

            input{
                padding-left:10px;
                font-size:1.15rem;
                margin:.5% 0 2% 0;
                height:2.5rem;
                border-radius:5px;
                border:1px solid grey;
                

                &[type="submit"]{
                    padding:inherit;
                    background-color:$action-color;
                    color:$bg-color;
                    border:1px solid $action-color;
                    margin:auto;
                    min-width:119px;
                    

                    &:hover{
                        border:1px solid #e0898f;
                        background-color: #e0898f; // 25 % lighter
                    }
                }
            }
        }

    }
</style>