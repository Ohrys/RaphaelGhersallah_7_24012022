<template>
    <form @submit.prevent="register">
    <div class="presentation-container">
        <img src="@/assets/svg/logo_name_below.svg"/>
    </div>
    <div class="form">
        <div>
            <label for="email">E-mail <em>*</em></label>
            <input id="email" name="email" pattern="[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})" v-model="email" placeholder="example@groupomania.fr" required>
        </div>
        <div>
            <label for="password">Mot de passe <em>*</em></label>
            <input id="password" name="password" pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{5,15})$" v-model="password" placeholder="Mot de passe" type="password" required>
        </div>
        <div>
            <label for="name">Nom <em>*</em></label>
            <input id="name" name="name" pattern="[a-zA-ZÀ-ÿ]{3,}" v-model="name" placeholder="Nom" required>
        </div>
        <div>
            <input type="submit" value="S'inscrire">
        </div>
    </div>
    </form>
</template>

<script>
    export default{
        name:"Register",
        data(){
            return{
                name:"",
                password:"",
                email:""
            }
        },
        methods:{
            async register(){
                const {name, password, email} = this; 

                const res = await fetch(
                    "http://localhost:3000/api/user/signup",
                    {
                        method:"POST",
                        headers:{
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify({
                            name,
                            password,
                            email,
                            isModerator:false
                        })
                    }
                );
                const data = await res.json();
                if(data.status == 1){
                  this.$router.push({name:'Login'})  
                }
            }
        }
    }
</script>

<style lang="scss">

    @import "@/scss/_variables.scss";

    .presentation-container{
        display:flex;
        flex-direction: column;
        align-items: center;
        
    
        img{
            width:95%;
            max-width:950px;
            max-height:500px;
            object-fit: cover;
            object-position:center;
        }
    }

    .form{
        font-size: 1.25rem;
        margin:auto;
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
                    background-color:$action-color;
                    color:$bg-color;
                    border:1px solid $action-color;
                    margin:auto;
                    width:30%;

                    &:hover{
                        border:1px solid #e0898f;
                        background-color: #e0898f; // 25 % lighter
                    }
                }
            }
        }

    }
</style>