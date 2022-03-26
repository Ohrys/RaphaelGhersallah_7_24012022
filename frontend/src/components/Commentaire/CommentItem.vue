<template>
    <div id="comment__container">
        <div class="moderator" v-if="comment.author.idUser == this.user.idUser || this.user.isModerator">
            <button :title="'Supprimer '+ comment.content.substring(0,10)+'...'" @click="deleteComment">❌</button>
        </div>
        <div>
            [{{dateCreation}}] {{comment.author.name}} : {{comment.content}}
        </div>
    </div>
</template>

<script>
import Cookie from 'js-cookie';
import { mapState } from 'vuex';
export default {
    props:{
        comment: {
        type: Object,
        required:true
        }
    },
    computed:{
        ...mapState(['user']),
        dateCreation(){
            let date_timestamp = this.comment.creationDate;
            var date = new Date( date_timestamp * 1);
        
            var formattedTime = date.toLocaleDateString();

            return formattedTime;
        }
    },
    methods:{
        deleteComment:async function(){
            console.log('suppression du commentaire : '+this.comment.idReply);
        await fetch(
        "http://localhost:3000/api/reply/"+this.comment.idReply,{
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
#comment__container{
    display:flex;

    margin:5px;
    

}
</style>