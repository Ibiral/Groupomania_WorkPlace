<template>
    <!-- Affichage des informations d'une publication sur le mur -->
    <div class="single-post-onePostWall">
        <div class="onePostWallInfos">
            <div class="userInfos-onePostWall onePostWall-elements">
                <img v-bind:src="userProfilePic" alt="photo de profil" class="userProfileImg-onePostWall">
                <span class="userName-onePostWall">{{userFirstName}} {{userLastName}}</span>
            </div>
            <h2 class="onePostWall-elements">{{ title }}</h2>
            <p class="postContent-onePostWall onePostWall-elements">{{ content }}</p>
            <img @click="goToPost" v-show="imgUrl" v-bind:src="imgUrl" alt="image-du-post" class="post-image onePostWall-elements">
            <div class="feed-onePostWall onePostWall-elements">
                <p>
                    <!-- Affichage du nombre de commentaires-->
                    <span @click="goToPost" id="commentaires-link">{{ comments.length }} Commentaires <font-awesome-icon :icon="['fas', 'comment']" /></span>
                </p>
                <p class="likeButtonWall onePostWall-elements">
                    <!-- Affichage du nombre de Likes-->
                    <span class="like-span-onePostWall"><button class="OnepostLikeBtn onePostFeedBtn" @click="likePost(postId)" ><font-awesome-icon :icon="['fas', 'heart']" /> </button> {{ nbOfLikes }} </span>
                </p>
            </div>
        </div>
        <button class="redirectToOnePost" @click="goToPost">Afficher les commentaires</button>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'OnePostWall',
    props: {
        title: String,
        userFirstName: String,
        userLastName: String,
        userProfilePic: String,
        imgUrl: String,
        content: String,
        comments: Array,
        reactions: Array,
        linkUrl: String,
        postId: Number
    },
    data() {
        return {
            nbOfLikes: '',
            like : 1,
        }
    },
    mounted() {
        this.nbOfLikes = this.reactions.filter(i => i.type === true).length;
        if (this.userProfilePic === null) {
            this.userProfilePic = require("@/assets/images/user-default-profile-img.png")
        }
    },
    methods: {
        // Création d'un nouveau Like et l'enregistrer dans le Backend
        likePost(postId) {
            let reaction = {
                like: this.like
            }
            axios.post('http://localhost:3000/api/posts/'+ postId + '/react', reaction, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.$emit('newReaction');
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        },
        goToPost() {
            this.$router.push(this.linkUrl);
        }
    }
}
</script>

<style>

.onePostWall-elements {
    margin-bottom: 2%;
}
.single-post-onePostWall {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: relative;
    font-weight: bolder;
    padding-top: 3%;
    padding-bottom: 3%;
    
}

.userInfos-onePostWall {
    display: flex;
    align-items: center;
}

.userProfileImg-onePostWall {
    float: left;
    width:  45px;
    height: 45px;
    object-fit: cover;
    border-radius: 50%;
}

.userName-onePostWall {
    font-size: 1.3em;
    color: #0b3d71;
    margin-left: 4%;
    
}

.onePostWallInfos {
    text-align: left;
    width: 75%;
}



.postContent-onePostWall {
    font-size: 1.2em;
    font-weight: lighter;
}

.post-image  {
    display: block;
    margin-left: auto;
    margin-right: auto;
    border-radius: 3px;
    width: 100%;
    height: auto;
    object-fit: cover;
    cursor: pointer;
}

.feed-onePostWall {
    display: flex;
    justify-content: space-between;
    font-size: 1.1em;
    color: #354C5F;
}

#commentaires-link {
    cursor: pointer;
}

.onePostFeedBtn {
    border: none;
    font-size: 1em;
    cursor: pointer;
}

.like-span-onePostWall {
    color: #354C5F;
}

.OnepostLikeBtn {
    color: #fd1b1b;
    background: none;
}
.OnepostLikeBtn:focus {
    outline: none;
    box-shadow: none;
}

.redirectToOnePost {
  background-color: #335d88;
  color: #FFFFFF;
  border-radius: 3px;
  padding: 1%;
  width: auto;
  height: 1%;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 1.5px 1px 3px grey;

  transition: all 0.1s ease;
}
.redirectToOnePost:hover {
    transform: scale(1.05);
}
.redirectToOnePost:focus {
    outline: none;
    box-shadow: none;
}


@media (max-width: 768px) {
    .feed-wallsinglepost {
        font-size: 0.95em;
    }

    .likeButtonWall {
        width: 27%;
    }

    .redirectToOnePost {
        padding: 2%;
        margin-top: 1%;
    }
    .wallsinglepost-elements {
        margin-bottom: 4%;
    }
    .postContent-wallsinglepost {
        font-size: 1em;
    }
}
</style>