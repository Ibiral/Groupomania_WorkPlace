<template>
    <div class="onePostPage">
        <section class="OnePostContainer">
            <div class="onePostInfos">
                <div class="onePostUserInfos onePostElt">
                    <img v-bind:src="post.User.profilePic" alt="photo de profil" class="onePostUserProfileImg">
                    <span class="onePostUser">{{post.User.firstName}} {{post.User.lastName}}</span>
                </div>
                <h2 class="onePostElt">{{ post.title }}</h2>
                <p class="onePostContent onePostElt">{{ post.content }}</p>
                <img v-show="post.attachment" v-bind:src="post.attachment" alt="publication image" class="onePostImg onePostElt">
                <div class="reaction-infos-singlepost onePostElt">
                    <p class="onePostElt">
                        <!-- Afficher le nombre de commentaires sur une publication -->
                        <span>{{ post.Comments.length }} Commentaires <font-awesome-icon :icon="['fas', 'comment']" /></span>
                    </p>
                    <p class="likeButton onePostElt">
                        <!-- Afficher le nombre de Like sur une publication -->
                        <span class="onePostLikeSpan"><button class="like-button-singlepost reaction-button-singlepost" @click="likePost(post.id)" ><font-awesome-icon :icon="['fas', 'heart']" /></button> {{ nbOfLikes }}</span>
                    </p>
                </div>
                <!-- Une boucle pir créer chaque commentaire dans [commentaires] -->
                <div class="CommentsList" v-for="comment in post.Comments" :key="comment.id">
                    <Comment @commentDeleted="fetchOnePost"
                    v-bind:profilePic="comment.User.profilePic"
                    v-bind:firstName="comment.User.firstName" 
                    v-bind:lastName="comment.User.lastName"
                    v-bind:content="comment.content"
                    v-bind:commentId="comment.id"
                    v-bind:userId="comment.User.id"
                    v-bind:connectedUserId="connectedId"
                    v-bind:postId="urlPostId"
                    v-bind:isAdmin="isAdmin" />
                </div>
                <!-- Ajout d'un nouveau commentaire -->
                <div class="form-container-comment">
                    <form @submit.prevent="commentPost(post.id)" id="form-comment" class="validation">
                        <div class="form-input">
                            <textarea v-model="comment" name="commentaire" id="comment" required placeholder="ajouter un commentaire ici..." />
                        </div>
                        <div class="ContainerCommentBtn">
                            <input class="CommentBtn" type="submit" value="Commenter">
                        </div>
                        <span class="ContainerMsgErr">{{ commentErrorMsg }}</span>
                    </form>
                </div>
            </div>
        </section>
        <!-- Modification ou suppression de la publication -->
        <section v-show="AllowedToUpdateAndDelete" class="form-container">
            <div class="form-title"> 
                <h1>Modifier ou retirer ma publication</h1>
            </div>
            <form id="form" class="validation" @submit.prevent="updatePost" enctype="multipart/form-data">
                <div class="form-input">
                    <label for="titre"></label>
                    <input type="text" v-model="title" name="titre" id="title" placeholder="Nouveau Titre">
                </div>
                <div class="form-input">
                    <label for="contenu"></label>
                    <textarea type="text" v-model="content" name="contenu" id="content" placeholder="Nouveau message" />
                </div>
                <div class="form-input">
                    <label for="image">Image: </label>
                    <input type="file" ref="file" @change="selectedFile" name="image" id="updatePostImg">
                </div>
                <div class="form-input" id="imgPreview">
                    <label v-if="imgPreview" for="aperçu-photo">Aperçu de l'image:</label>
                    <img id="post-preview" v-if="imgPreview" :src="imgPreview" alt="aperçu-de-la-photo-de-profil" />
                </div>
                <div class="submitContainerBtn">
                    <input type="submit" class="submitBtn" value="Modifier ">
                    <button class="delete-post-button" v-show="AllowedToUpdateAndDelete" @click="deletePost">Retirer la publication</button>
                </div>
                <div class="ContainerMsgErr">
                    <p class="modify-post-error-msg">{{ modifyPostErrorMsg }}</p>
                </div>
                    <div>{{ deleteError }}</div>
            </form>
        </section>
    </div>
</template>

<script>
import axios from 'axios';
import Comment from './Comment';
export default {
    name: 'Post',
    components: {
        Comment
    },
    data () {
        return {
            post: {
                User: {
                    firstName: '',
                    lastName: '',
                    profilePic: '',
                    id: '',
                },
                Comments: []
            },
            Feed: [],
            title: '',
            content: '',
            file: '',
            imgPreview: '',
            userIdOrder: '',
            nbOfLikes: '',
            comment: '',
            connectedId: '',
            urlPostId: '',

            profileInfos: [],
            isAdmin: '',

            // L'utilisateur lui-même ou l'admin seulement autorisé à modifier ou supprimer la publication
            AllowedToUpdateAndDelete:'',
            
            //Récupérer le nombre des likes à partir du mur
            like : 1,

            modifyPostErrorMsg: '',
            commentErrorMsg: '',
            deleteError: '',
            // Vérification des entrées utilisateur
            titleRegex: /^([a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,)(]{1,50})?$/,
            contentRegex: /^([a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,\n)(]{1,300})?$/,
            commentRegex: /^[a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,\n)(]{1,100}$/
        }
    },
  
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login')
        } else {
            this.getUserConnectedInfos();
            this.urlPostId = this.$route.params.id;
            axios.get('http://localhost:3000/api/posts/' +  this.urlPostId, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.post = res.data.singlePost;
                if (this.post.User.profilePic === null) {
                    this.post.User.profilePic = require("@/assets/images/user-default-profile-img.png")
                }
                this.Feed = res.data.singlePost.UserReacts;
                this.userIdOrder = res.data.singlePost.UserId;
                this.connectedId = res.data.userConnected;
                
                // Vérifier si l'utilisateru est autorisé à modifier ou supprimer la publication
                if (this.userIdOrder === this.connectedId || this.isAdmin === true) {
                    this.AllowedToUpdateAndDelete = true
                }
                // Afficher le nombre de likes
                this.nbOfLikes = this.Feed.filter(i => i.type === true).length;
            })
        }
    },
    methods: {
        // affichage de l'aperçu de l'image séléctionnée
        selectedFile() {
            this.file = this.$refs.file.files[0];
            this.imgPreview = URL.createObjectURL(this.file);
        },
        // Envoi des modificatios vers le backend
        updatePost() {
            let titleCheck = this.titleRegex.test(this.title);
            let contentCheck = this.contentRegex.test(this.content);

            if (titleCheck == false) {
                this.modifyPostErrorMsg = 'Titre invalide ! Le texte doit contenir 50 caractères max et pas de caractères spéciaux'
            } else if (contentCheck == false) {
                this.modifyPostErrorMsg = 'Texte invalide ! Le texte doit contenir 300 caractères max et pas de caractères spéciaux'
            } else {
                const formData = new FormData();
                formData.append('newTitle', this.title);
                formData.append('newContent', this.content);
                formData.append('inputFile', this.file);
                formData.append('userIdOrder', this.userIdOrder);
                console.log(formData);
                axios.put('http://localhost:3000/api/posts/' +  this.$route.params.id, formData, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
                .then(res => {
                    window.scrollTo(0,0);
                    console.log(res);
                    this.modifyPostErrorMsg = '',
                    this.title = '';
                    this.content = '';
                    this.file = '';
                    this.imgPreview = '';
                    this.fetchOnePost()
                }, err => {
                    console.log(err.response);
                    this.error = err.response.data.error;
                })
            }
        },
        // Récupérer les informations d'une publication
        fetchOnePost() {
            axios.get('http://localhost:3000/api/posts/' +  this.$route.params.id, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
            console.log(res);
            this.post = res.data.singlePost;
            if (this.post.User.profilePic === null) {
                this.post.User.profilePic = require("@/assets/images/user-default-profile-img.png")
            }
            this.Feed = res.data.singlePost.UserReacts;
            this.userIdOrder = res.data.singlePost.UserId;
            this.nbOfLikes = this.Feed.filter(i => i.type === true).length;
            this.nbOfDislikes = this.Feed.filter(i => i.type === false).length;
            })
        },
        // Method that request to the backend to delete a specific post
        deletePost() {
            axios.delete('http://localhost:3000/api/posts/' +  this.$route.params.id, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}, data: {userIdOrder: this.userIdOrder}})
            .then(res => {
            console.log(res);
            this.$router.push('/wall')
            }, err => {
                console.log(err.response);
                this.deleteError = err.response.data.error;
            })
        },
        // Method that makes an axios call to the backend to create a new LIKE on the post
        likePost(postId) {
            let reaction = {
                like: this.like
            }
            axios.post('http://localhost:3000/api/posts/'+ postId + '/react', reaction, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.fetchOnePost()
            }, err => {
                console.log(err.response);
                this.error = err.response.data.error;
            })
        },
        // Method that send the comment form infos to create a new comment
        commentPost(postId) {
            let commentRESULT = this.commentRegex.test(this.comment);

            if (commentRESULT == false) {
                this.commentErrorMsg = 'Texte non valide ! 100 Caractères maximum et évitez les caractères spéciaux'
            } else {
                let comment = {
                    content: this.comment
                }
                axios.post('http://localhost:3000/api/posts/'+ postId + '/comment', comment, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
                .then(res => {
                    console.log(res);
                    this.comment = '';
                    this.commentErrorMsg = '';
                    this.fetchOnePost()
                }, err => {
                    console.log(err.response);
                    this.error = err.response.data.error;
                })
            }
        },
        // Récupération des données utilisateur du Backend
        getUserConnectedInfos() {
            axios.get('http://localhost:3000/api/users/me', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.profileInfos = res.data;
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

.onePostElt {
    margin-bottom: 4%;
}

.delete-post-button {
    background-color: #e20606e6;
    color: #FFFFFF;
    /*border: none;*/
    border-radius: 3px;
    padding: 2%;
    margin: auto;
    width: auto;
    height: 1%;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 1.5px 1px 3px grey;
    transition: all 0.1s ease;
}

.delete-post-button:hover {
    transform: scale(1.05);
}

#updatePostImg {
    border: none;
    color: transparent;
}

.onePostPage {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 95%;
}

.OnePostContainer {
    background-color: #ffffff;
    border-radius: 50px;
    width: 100%;
    margin-top: 3%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: relative;
    font-weight: bolder;
    padding-top: 3%;
    padding-bottom: 3%;
    
}

.onePostUserInfos {
    display: flex;
    align-items: center;
}

.onePostUserProfileImg {
    float: left;
    width:  75px;
    height: 75px;
    object-fit: cover;
    border-radius: 50%;
}

.onePostUser {
    font-size: 1.3em;
    color: #0846AA;
    margin-left: 4%;
}

.onePostInfos {
    text-align: left;
    width: 60%;
}

.onePostContent {
    font-size: 1.2em;
    font-weight: lighter;
}

.onePostImg  {
    display: block;
    margin-left: auto;
    margin-right: auto;
    border-radius: 3px;
    width: 100%;
    height: auto;
    object-fit: cover;
}

.reaction-infos-singlepost {
    display: flex;
    justify-content: space-between;
    font-size: 1.1em;
    color: #354C5F;
}

.onePostLikeSpan {
    color: #354C5F;
}

.likeButton {
    display: flex;
    text-align: right;
    width: 10%;
    justify-content: space-between;
}

.reaction-button-singlepost {
    background: none;
    border: none;
    font-size: 1em;
    cursor: pointer;
}

.reaction-button-singlepost:focus {
  outline: none;
  box-shadow: none;
}


.like-button-singlepost {
    color: #fd1b1b;
}

.CommentsList {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.ContainerCommentBtn {
    text-align: center;
}

.ContainerMsgErr{
    display: flex;
    justify-content: center;
    color: rgb(212, 0, 0);
    margin-top: 1%;
}

.modify-post-error-msg {
    margin-top: 5%;
    width: 50%;
}

.form-container-comment {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 3%;
}

#form-comment {
    width: 100%;
    padding: 1.5rem;
    box-sizing: border-box;
    background: #30475e;
    color: white;
    border-radius: 50px;
}

#form-comment label {
    font-size: 1em;
}

#form-comment textarea {
    margin-top: 2%;
}

.comment-error-msg {
    margin-top: 5%;
    width: 50%;
}

.CommentBtn {
  background-color: #3c6c9ee6;
  color: #FFFFFF;
  /*border: none;*/
  border-radius: 3px;
  padding: 1%;
  width: auto;
  height: 1%;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 1.5px 1px 3px grey;
  
}
.CommentBtn:focus {
    outline: none;
    box-shadow: none;
}

img#post-preview {
    max-width: 150px;
    margin: auto;
}

img.onePostImg.onePostElt {
    max-width: 500px;
}

@media (max-width: 768px) {
    .likeButton {
        width: 27%;
    }
    .reaction-infos-singlepost {
        font-size: 0.95em;
    }
    .onePostContent {
    font-size: 1em;
    }
    .CommentBtn {
        padding: 2%;
    }
    .onePostInfos {
        text-align: left;
        width: 70%;
    }
    .onePostUserProfileImg {
        width:  45px;
        height: 45px;
    }

}
</style>