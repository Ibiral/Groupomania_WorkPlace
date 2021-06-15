<template>
        <div class="postsWallContainer">
            <!-- Affichage de toutes les publications -->
            <section class="listOfPostsContainer">
                <h1 class="postTitle">Votre espace d'échanges</h1>
                <router-link to="/add" @click="goToCreatePost"> <button class="postAddBtn">AJOUTER UNE NOUVELLE PUBLICATION <font-awesome-icon :icon="['fas', 'pencil-alt']" /></button> </router-link>
                <!-- Boucle pour afficher chaque publication ajoutée -->
                <div v-for="post in listOfPosts" :key="`${post.id}-${post.UserReacts.filter(i => i.type === true).length}-${post.UserReacts.filter(i => i.type === false).length}`" class="single-post-container">
                    <OnePostWall @newReaction="fetschWall"
                    v-bind:title="post.title" 
                    v-bind:userFirstName="post.User.firstName"
                    v-bind:userLastName="post.User.lastName"
                    v-bind:userProfilePic="post.User.profilePic"
                    v-bind:imgUrl="post.attachment"
                    v-bind:content="post.content"
                    v-bind:comments="post.Comments"
                    v-bind:reactions="post.UserReacts"
                    v-bind:linkUrl="'/post/'+ post.id"
                    v-bind:postId="post.id"/>
                </div>
            </section>
        </div>
</template>

<script>
import axios from 'axios';
import OnePostWall from './OnePostWall';

export default {
    name: 'PostsWall',
    components: {
        OnePostWall
    },
    data () {
        return {
            // En attente des informations retournées par le Backend
            listOfPosts : [],

            profileInfos: [],

            userProfilePic: '',

            onePostUrl: 'http://localhost:3000/api/posts/',
        }
    },
    
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login')
        } else {
            this.getUserConnectedInfos();
        }
    },
    // Récupération de toutes les publications dans la base de données
    mounted() {
        axios.get('http://localhost:3000/api/posts' , {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        .then(res => {
            console.log(res);
            const resData = res.data;
            this.listOfPosts = resData;
        
        }, err => {
            console.log(err.response);
            this.error = err.response.data.error;
        })
    },
    methods: {
        fetschWall() {
            axios.get('http://localhost:3000/api/posts', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
            console.log(res);
            this.listOfPosts = res.data;

            })
        },

        goToCreatePost() {
            this.$router.push('/add')
        },
        // Récupération des informations de l'utilisateur
        getUserConnectedInfos() {
            axios.get('http://localhost:3000/api/users/me', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.profileInfos = res.data;
                if (this.profileInfos.profilePic === null) {
                    this.profileInfos.profilePic = require("@/assets/images/user-default-profile-img.png")
                }
                this.isAdmin = res.data.isAdmin;
            }, err => {
                console.log(err.response);
                this.$router.push('/login')
                this.error = err.response.data.error;
            })
        }
    }
}
</script>

<style>

.postsWallContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 3%;
}

.listOfPostsContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.postTitle {
    margin-bottom: 5%;
    color: white;
}

.postAddBtn {
    background-color: #335d88;
    color: #FFFFFF;
    border-radius: 15px;
    padding: 1%;
    margin-bottom: 30px;
    width: auto;
    height: 1%;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 1.5px 1px 3px grey;
    transition: all 0.1s ease;
}

.postAddBtn:hover {
    transform: scale(1.05);
}

.single-post-container {
    background-color: #ffffff;
    border-radius: 10px;
    width: 65%;
    margin-bottom: 3%;
    position: relative;
}

@media (max-width: 480px) {

    .single-post-container {
        width: 80%;
    }
}
</style>