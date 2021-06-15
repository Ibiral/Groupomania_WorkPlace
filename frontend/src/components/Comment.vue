<template>
        <div class="CommentUserInfos">
            <img v-bind:src="profilePic" alt="photo du profil" class="CommentUserImg">
            <div class="commentTextInput">
                <span class="commentUserName" >{{ firstName }} {{ lastName }}</span>:
                <p class="commentContent">{{ content }}</p>
            </div>
            <!-- Suppression du commentaire par l'utilisateur lui même ou par l'admin -->
            <button class="deletCommentBtn" v-show="allowedToDeleteComment" @click="deleteComment(commentId, userId)"><font-awesome-icon :icon="['fas', 'trash-alt']" /></button>
            {{ error }}
        </div>
</template>

<script>
import axios from 'axios';

export default {
    Name: 'Comment',
    props: {
        profilePic: String,
        firstName: String,
        lastName: String,
        content: String,
        commentId: Number,
        userId: Number,
        connectedUserId: Number,
        postId: String,
        isAdmin: Boolean
    },
    data() {
        return {
            allowedToDeleteComment: '',
            error: ''
        }
    },
    mounted() {
        //Suppression du commentaire par l'utilisateur lui même ou par l'admin
        if (this.userId === this.connectedUserId || this.isAdmin === true) {
            this.allowedToDeleteComment = true
        }
        if (this.profilePic === null) {
            this.profilePic = require("@/assets/images/user-default-profile-img.png")
        }
    },
    methods: {
        // Envoi d'une requête Delete au Backend
        deleteComment(commentId, commentUserId) {
            axios.delete('http://localhost:3000/api/posts/' +  this.postId + '/comment/' + commentId, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}, data: {userIdOrder: commentUserId}})
            .then(res => {
            console.log(res);
            this.$emit('commentDeleted')
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        }
    }
}
</script>

<style>

.comment-container {
    border: solid black 1px;
    border-radius: 4px;
    display: flex;
    width: 100%;
}

.CommentUserInfos {
    display: flex;
    justify-content: flex start;
    width: 100%;
}

.CommentUserImg {
    float: left;
    width:  30px;
    height: 30px;
    object-fit: cover;
    border-radius: 50%;
    margin: 0.7%;
}

.commentTextInput {
    background: #e8f4ff;
    border-radius: 10px;
    padding: 1.2%;
    margin: 0.7%;
    width: auto;
}

.commentUserName {
    font-style: italic;
}

.commentContent {
    font-size: 1.2em;
    font-weight: lighter;
}

.deletCommentBtn {
    border: none;
    background: none;
    color: #521919;
    font-size: 1.2em;
    cursor: pointer;
    transition: all 0.1s ease;
}
.deletCommentBtn:hover {
  transform: scale(1.1);
}

.deletCommentBtn:focus {
  outline: none;
  box-shadow: none;
}

@media (max-width: 768px) {
    .CommentUserImg {
        margin: 2%;
    }
    .commentContent {
    font-size: 1em;
    }
    .commentTextInput {
        padding: 3%;
        margin: 2%;
    }
    .deletCommentBtn {
        font-size: 1em;
    }
}

</style>