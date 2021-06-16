<template>
    <div class="profileComponent">
        <section class="profile-container">
            <h1 >Mes coordonnées</h1>
            <div class="profileInfos">
                <p class="profileInfo"><span class="profileInfo-span">Prénom: </span>{{profileInfos.firstName}}</p>
                <p class="profileInfo"><span class="profileInfo-span">Nom: </span>{{profileInfos.lastName}}</p>
                <p class="profileInfo"><span class="profileInfo-span">Bio: </span>{{profileInfos.bio}}</p>
                <p class="profileInfo"><span class="profileInfo-span">E-mail: </span>{{profileInfos.email}}</p>
                <p class="profileInfo" id="profileImg"><span class="profileInfo-span">Photo de Profil: </span>
                <img v-bind:src="profileInfos.profilePic" alt="photo de profil" id="myProfileImage"></p>
            </div>
        </section>
        <!-- Modification des coordonnées utilisateur -->
        <section class="form-container">
            <h1 class="updateProfileTitle">Modifier mon profil<font-awesome-icon :icon="['fas', 'user-edit']" /></h1>
            <form @submit.prevent="updateProfile" enctype="multipart/form-data" id="form" class="validation">
                <div class="form-input">
                    <label for="Prenom"></label>
                    <input type="text" v-model="firstName" name="Prenom" id="firstName" placeholder="Nouveau prénom">
                </div>
                <div class="form-input">
                    <label for="Nom"></label>
                    <input type="text" v-model="lastName" name="Nom" id="lastName" placeholder="Nouveau nom">
                </div>
                <div class="form-input">
                    <label for="bio"></label>
                    <textarea v-model="bio" name="bio" id="bio" placeholder="Nouvelle Biographie" />
                </div>
                <div class="form-input">
                    <label for="photo-de-profil">Nouvelle photo</label>
                    <input type="file" ref="file" @change="selectedFile" name="photo-de-profil" id="updateProfileImg">
                </div>
                <div class="form-input" id="post-preview-container">
                    <label v-if="imgPreview" for="aperçu-photo">Aperçu de l'image:</label>
                    <img id="post-preview" v-if="imgPreview" :src="imgPreview" alt="photo de profil" />
                </div>
                <div class="submitContainerBtn">
                    <input type="submit" class="submitBtn" value="Modifier">
                    <button class="deleteProfileBtn" @click="deleteProfile">Supprimer</button>
                </div>
                <div class="ContainerMsgErr">
                    <p class="updateProfileErrMsg">{{ updateProfileErrMsg }}</p>
                </div>
            </form>
        </section>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'MyProfile',
    data () {
        return {
            // Récupérer les inputs grâce à v-model
            profileInfos: '',
            firstName: '',
            lastName: '',
            bio: '',
            file: '',
            imgPreview: '',
            updateProfileErrMsg: '',
            deleteProfileErrorMsg: '',

            // Verification des entrés utilisateur
            nameRegex: /^([a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ- ']{1,30})?$/,
            textRegex: /^([a-zA-ZÀ-ÿ0-9"][a-zA-ZÀ-ÿ-0-9- '"!?.:;,\n)(]{1,100})?$/
        }
    },
    // Si l'utilisateur est introuvable, afficher la page login
    created() {
        if (localStorage.getItem('token') === null) {
            this.$router.push('/login')
        }
    },
    // Récupérer les informations de l'utilisateur du Backend
    mounted() {
        axios.get('http://localhost:3000/api/users/me', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
        .then(res => {
            console.log(res);
            this.profileInfos = res.data;
            if (this.profileInfos.profilePic === null) {
                this.profileInfos.profilePic = require("@/assets/images/user-default-profile-img.png")
            }
        }, err => {
            console.log(err.response);
            this.$router.push('/login')
            this.error = err.response.data.error;
        })
    },
    methods: {
        // Affichage d'un aperçu de l'image chargée
        selectedFile() {
            this.file = this.$refs.file.files[0];
            this.imgPreview = URL.createObjectURL(this.file);
        },
        // Modification du profil utilisateur
        updateProfile() {
            let firstnameCheck = this.nameRegex.test(this.firstName);
            let lastnameCheck = this.nameRegex.test(this.lastName);
            let bioCheck = this.textRegex.test(this.bio);

            if (firstnameCheck == false || lastnameCheck == false) {
                this.updateProfileErrMsg = 'Nom/Prénom est invalide'
            } else if (bioCheck == false) {
                this.updateProfileErrMsg = 'La biographie doit contenir 100 caractères au maximum ou elle contient des caractères spéciaux non autorisés)'
            } else {
                const formData = new FormData();
                formData.append('lastName', this.lastName);
                formData.append('firstName', this.firstName);
                formData.append('bio', this.bio);
                formData.append('inputFile', this.file);
                console.log(formData);
                axios.put('http://localhost:3000/api/users/update', formData, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
                .then(res => {
                    console.log(res);
                    this.updateProfileErrMsg = '',
                    this.lastName = '';
                    this.firstName = '';
                    this.bio = '';
                    this.file = '';
                    this.imgPreview = '';
                    this.updatedProfile()
                }, err => {
                    console.log(err.response);
                    this.updateProfileErrMsg = err.response.data.error;
                })
                }
        }, 
        // Redemader les informations utilisateur (modifiées) au Backend
        updatedProfile() {
            axios.get('http://localhost:3000/api/users/me', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
                console.log(res);
                this.profileInfos = res.data;
                if (this.profileInfos.profilePic === null) {
                    this.profileInfos.profilePic = require("@/assets/images/user-default-profile-img.png")
                }
            }, err => {
                console.log(err.response);
                this.$router.push('/login')
                this.error = err.response.data.error;
            })
        },
        // Supprimer le profile (le compte utilisateur)
        deleteProfile() {
            if (confirm("êtes vous sur de supprimer difinitivement votre compte ? Appuyez sur OK pour confirmer")) {
                axios.delete('http://localhost:3000/api/users/delete', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}})
            .then(res => {
            console.log(res);
            localStorage.clear();
            this.$router.push('/signup')
            }, err => {
                console.log(err.response);
                this.deleteProfileErrorMsg = err.response.data.error;
            })
            }
        }
    }
}
</script>

<style>
.deleteProfileBtn {
    background-color: #c00000;
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
}

.profile-container {
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 3%;
    text-align: center;
}

.profile-container h1 {
    margin-bottom: 3%;
}

.profileInfos {
    background-color: #FFFFFF;
    border-radius: 2%;
    width: 100%;
    height: auto;
    padding: 5%;
}


.profileInfo {
    min-width: 30%;
    margin-top: 3%;
}

.profileInfo-span {
    font-weight: bolder;
}

#myProfileImage {
   width:  180px;
   height: 180px;
   object-fit: cover;
   border-radius: 50%;
   margin-top: 3%;
   margin-left: auto;
   margin-right: auto;
}

#profileImg {
    display: flex;
    flex-direction: column;
}

.updateProfileTitle {
    margin-bottom: 3%;
}

#updateProfileImg {
    border: none;
    color: transparent;
}

.ContainerMsgErr{
    display: flex;
    justify-content: center;
    color: rgb(212, 0, 0);
}

.updateProfileErrMsg {
    margin-top: 5%;
    width: 50%;
}

@media (max-width: 768px) {
    .profileComponent {
        flex-direction: column;
        margin-bottom: 4%;
    }

    .profileInfos {
        width: 80%;
        margin-bottom: 5%;
    }

    #myProfileImage {
        width:  150px;
        height: 150px;
    }
}

</style>