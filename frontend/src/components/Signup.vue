<template>
    <!-- Formulaire Signup -->
    <div class="form-container">
        <h1 class="formTitle">S'inscrire</h1>
        <form @submit.prevent="signUp" enctype="multipart/form-data" action="" id="form" class="validation">
            <div class="form-input">
                <label for="Prenom"></label>
                <input type="text" v-model="firstName" name="Prenom" id="firstnameSignup"  placeholder="Prénom" required/>
            </div>
            <div class="form-input">
                <label for="Nom"></label>
                <input type="text" v-model="lastName" name="Nom" id="lastnameSignup"  placeholder="Nom" required>
            </div>
            <div class="form-input">
                <label for="email"></label>
                <input type="email" v-model="email" name="email" id="emailSignup"  placeholder="Email" required/>
            </div>
            <div class="form-input
            ">
                <label for="password"></label>
                <input type="password" v-model="password" name="password" id="passwordSignup" placeholder="Mot de passe" required />
            </div>
            <div class="form-input">
                <label for="password"></label>
                <input type="password" v-model="passwordConfirmation" name="passwordConfirmation" id="passwordConfirmationSignup" placeholder="Confirmation du mot de passe" required />
            </div>
            <div class="form-input">
                <label for="bio"></label>
                <textarea v-model="bio" name="bio" id="bioSignup" placeholder="Biographie (facultative)" />
            </div>
            <div class="form-input">
                <label for="photoProfil">Photo (facultative)</label>
                <input type="file" ref="file" @change="selectedFile" name="photoProfil" id="myProfileImg">
            </div>
            <div class="form-input" id="signupPreviewContainer">
                <label v-if="imgPreview" for="imgPreview">L'image chargée:</label>
                <img id="signupPreview" v-if="imgPreview" :src="imgPreview" alt="Aperçu photo de profil" />
            </div>
            <div class="submitContainerBtn">
                <input type="submit" class="submitBtn" value="S'inscrire !" />
            </div>
           <div class="ContainerMsgErr">
            <p class="signupMsgErr">{{ signupErrorMsg }}</p>
            </div>
        </form>
        <a id="signupToLogin" v-bind:href="loginUrl">Je suis déjà inscris</a>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Signup',
    data () {
        return {
            // Récupérer les entrées utilisateur grâce à v-model
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            bio: '',
            file: '',
            imgPreview: '',
            loginUrl: '/login',
            signupErrorMsg: '',

            // Vérification des entrées utilisateur
            nameRegex: /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ- ']{1,30}$/,
            emailRegex: /^[a-z0-9._-]+@[a-z0-9.-]{2,}[.][a-z]{2,3}$/,
            passwordRegex: /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})$/,
            bioRegex: /^([a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,\n)(]{1,100})?$/
        }
    },
    methods:{
        // Aperçu de l'image de profil chargée par l'utilisateur
        selectedFile() {
        this.file = this.$refs.file.files[0]; //Récupérer l'image de l'input
        this.imgPreview = URL.createObjectURL(this.file); //La méthode statique URL.createObjectURL() crée une chaîne contenant une URL représentant l’objet passé en paramètre
        },
        // Envoi des informations utilisateur vers la Backend pour créer un nouveau compte
        signUp() {
            let firstnameCheck = this.nameRegex.test(this.firstName);
            let lastnameCheck = this.nameRegex.test(this.lastName);
            let emailCheck = this.emailRegex.test(this.email);
            let passwordCheck = this.passwordRegex.test(this.password);
            let bioCheck = this.bioRegex.test(this.bio);

            if (firstnameCheck == false || lastnameCheck == false) {
                this.signupErrorMsg = 'Nom/Prénom est invalide'
            } else if (emailCheck == false) {
                this.signupErrorMsg = 'Email invalide'
            } else if (passwordCheck == false) {
                this.signupErrorMsg = 'Mot de passe doit contenir entre 6 et 20 caractères, minimum 1 majuscule, 1 minuscule et 1 chiffre'
            } else if (this.passwordConfirmation != this.password) {
                this.signupErrorMsg = 'Les deux mots de passe ne correspondent pas'
            } else if (bioCheck == false) {
                this.signupErrorMsg = 'La biographie doit contenir 100 caractères au maximum ou elle contient des caractères spéciaux non autorisés)'
            } else {
                const userData = new FormData();
                userData.append('email', this.email);
                userData.append('firstName', this.firstName);
                userData.append('lastName', this.lastName);
                userData.append('password', this.password);
                userData.append('bio', this.bio);
                userData.append('inputFile', this.file);
                console.log(userData)
                axios.post('http://localhost:3000/api/users/signup', userData, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(res => {
                    console.log(res);
                    this.signupErrorMsg= '';
                    this.$router.push('/login');
                }, err => {
                    console.log(err.response);
                    this.signupErrorMsg = err.response.data.error;
                })
            }
        }
    }
}
</script>

<style>
#myProfileImg {
    border: none;
    cursor: pointer;
    color: transparent;
}
#myProfileImg:focus {
    outline: none;
    box-shadow: none;
}

#signupPreview {
   width:  200px;
   height: 200px;
   object-fit: cover;
   border-radius: 50%;
   margin-left: auto;
   margin-right: auto;
}

#signup-button-container {
    display: flex;
    justify-content: center;
}

.ContainerMsgErr{
    display: flex;
    justify-content: center;
    color: rgb(212, 0, 0);
}

.signupMsgErr {
    width: 50%;
}


#signupToLogin, #loginToSignup {
    background-color: #3c6c9ee6;
    color: #FFFFFF;
    border: none;
    border-radius: 50px;
    padding: 3%;
    margin-top: 5%;
    width: auto;
    height: 1%;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 1.5px 1px 3px grey;
    text-decoration: none;
    margin-bottom: 5%;

    transition: all 0.1s ease;
}

#signupToLogin:hover, #loginToSignup:hover {
    transform: scale(1.05);
}

</style>