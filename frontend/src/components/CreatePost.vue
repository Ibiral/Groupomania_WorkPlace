<template>
    <section class="form-container">
         <router-link to="/wall" @click="goToWall"> <button class="postAddBtn">Accéder aux publications <font-awesome-icon :icon="['fas', 'directions']" /></button> </router-link>
        <div class="CreatePostFormTitle">
            <h1>Que voulez-vous partager aujourd'hui ?</h1>
        </div>
        <form action="" @submit.prevent="createPost" enctype="multipart/form-data" id="form" class="validation">
            <div class="form-input">
                <label for="titre"></label>
                <input type="text" v-model="title" name="titre" id="title" placeholder="Mon titre" required>
            </div>
            <div class="form-input">
                <label for="contenu"></label>
                <textarea v-model="content" name="contenu" id="content" placeholder="Mon message" required  />
            </div>
            <div class="form-input">
                <label for="image">Image</label>
                <input type="file" ref="file" @change="selectedFile" name="image" id="add-post-pic">
            </div>
            <div class="form-input" id="postContainerPreview">
                <label v-if="imgPreview" for="preview">Aperçu de l'image:</label>
                <img id="postPreview" v-if="imgPreview" :src="imgPreview" />
            </div>
            <div class="submitContainerBtn">
                <input type="submit" class="submitBtn" value="Publier"  @click="goToWall" >
            </div>
            <div class="ContainerMsgErr">
                <p class="CreatePostErrMsg">{{ createPostErrorMsg }}</p>
            </div>
        </form>
    </section>
</template>

<script>
import axios from 'axios';
export default {
    name: 'CratePost',
    props: {
        firstName: String,
        lastName: String,
    },
    data () {
        return {
            // Récupérer les entrées utilisateur grâce à v-model
            title: '',
            content: '',
            file: '',
            imgPreview: '',
            goToWall: '',
            createPostErrorMsg: '',

            // Vérification des entrées utilisateur
            titleRegex: /^[a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,)(]{1,50}$/,
            contentRegex: /^[a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,\n)(]{1,300}$/
        }
    },
    methods: {
        // Aperçu de l'image de profil chargée par l'utilisateur
        selectedFile() {
            this.file = this.$refs.file.files[0];
            this.imgPreview = URL.createObjectURL(this.file);
        },
        // Envoi du formulaire vers la Backend pour créer une nouvelle publication
        createPost() {
            let titleCheck = this.titleRegex.test(this.title);
            let contentCheck = this.contentRegex.test(this.content);

            if (titleCheck == false) {
                this.createPostErrorMsg = 'Titre invalide ! Le texte doit contenir 50 caractères max et pas de caractères spéciaux'
            } else if (contentCheck == false) {
                this.createPostErrorMsg = 'Texte invalide ! Le texte doit contenir 300 caractères max et pas de caractères spéciaux'
            } else {
                const formData = new FormData();
                formData.append('title', this.title);
                formData.append('content', this.content);
                formData.append('inputFile', this.file);
                console.log(formData);
                axios.post('http://localhost:3000/api/posts/new' , formData, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
                .then(res => {
                    console.log(res);
                    this.title = '';
                    this.content = '';
                    this.file = '';
                    this.imgPreview = '';
                    // Affichage de la nouvelle publication sur le mur (elément parent)
                    this.$emit('newPost');
                    // Afficher le mur
                    this.goToWall = this.$router.push('/wall');
                }, err => {
                    console.log(err.response);
                    this.error = err.response.data.error;
                })
            }
        },
    }
}
</script>

<style>

h1 {
    text-align: center;
}

.form-title-createPost {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.add-post-user-pp {
    float: left;
    width:  45px;
    height: 45px;
    margin: 3%;
    object-fit: cover;
    border-radius: 50%;
}

#add-post-pic {
    border: none;
    color: transparent;
}

#postPreview {
   width:  40%;
   height: auto;
   object-fit: cover;
   border-radius: 2%;
   margin-left: auto;
   margin-right: auto;
}

.ContainerMsgErr{
    display: flex;
    justify-content: center;
    color: rgb(212, 0, 0);
}

.CreatePostErrMsg {
    margin-top: 5%;
    width: 50%;
}

.submitContainerBtn {
    display: flex;
}

.submitBtn {
    background-color: #388e26;
    color: #FFFFFF;
    border: none;
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
.submitBtn:hover {
    transform: scale(1.05);
}
.submitBtn:focus {
    outline: none;
    box-shadow: none;
}

</style>