<template>
<div class="app">
    <div class="app__header">
        <router-link to="/"><img class="header__logo" alt="logo GroupoMania" src='./assets/svg/logo_name_color.svg'/></router-link>
    </div>
    
    <router-view class="app__vue" />
</div>
</template>

<script>   
/*  plutôt dans homelogged.vue
export default{
    created(){
        actions.getUser()
    }
} */
</script>

<style lang="scss">
    @import "@/scss/_variables.scss";

    body{
        color:$text-color;
        background-color:$bg-color;
        font-size: 16px;
    }

    .header__logo{
        margin-left:5px;
        object-fit: cover;
        object-position:center;
        min-width:200px;
        height:100%;
    }

    .app__header{
        z-index: 1;
        width:100%;
        height:5%;
        position:fixed;
        top:0;
        left:0;
        background-color:rgba($text-color,.87);
        backdrop-filter: blur(8px);
        
        box-shadow:0px -5px 10px black;
    }

    

    .app__vue{
        //Afin d'éviter que la vue passe sous la barre de navigation.
        position:absolute;
        left:2.5%;
        top:6%;
        width:95%;
        height:94%;
        box-sizing: border-box;
    }

</style>