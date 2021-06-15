<template>
    <div class="form-container">
        <h1 class="formTitle">Connexion</h1>
        <form action="" @submit.prevent="login" id="form" class="validation">
            <div class="form-input">
                <label for="email"></label>
                <input type="email" v-model="email" name="email" id="email" required placeholder="Email">
            </div>
            <div class="form-input">
                <label for="password"></label>
                <input type="password" v-model="password" name="password" id="password" required placeholder="Mot de passe">
            </div>
            <div class="submitContainerBtn">
                <input type="submit" class="submitBtn" value="Se connecter">
            </div>
            <div class="ContainerMsgErr">
                <p class="loginMsgErr">{{ loginErrorMsg }}</p>
            </div>
        </form>
        <a id="loginToSignup" v-bind:href="signupUrl">Créer mon compte</a>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: 'Login',
    data () {
        return {
            // Data to catch what the user will write in the form inputs, using v-model
            email: '',
            password: '',
            signupUrl: '/signup',
            loginErrorMsg: '',
            // Vérification des entrées utilisateur
            emailRegex: /^[a-z0-9._-]+@[a-z0-9.-]{2,}[.][a-z]{2,3}$/,
            passwordRegex: /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20})$/
        }
    },
    methods: {
        // Envoi des informations utilisateur vers la Backend pour s'authentifier
        login() {
            let emailCheck = this.emailRegex.test(this.email);
            let passwordCheck = this.passwordRegex.test(this.password);

            if (emailCheck == false) {
                this.loginErrorMsg = 'Email invalide'
            } else if (passwordCheck == false) {
                this.loginErrorMsg = 'Mot de passe invalide'
            } else {
                    let user = {
                    email: this.email,
                    password: this.password
                }
                axios.post('http://localhost:3000/api/users/login', user)
                .then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        this.loginErrorMsg = ''
                        localStorage.setItem('token', res.data.token); //Sauvegarder le token reçu dans le localStorage
                        // localStorage.setItem('userId', res.data.userId);
                        this.$router.push('/wall');
                    }
                }, err => {
                    console.log(err.response);
                    if (err.request.status !== 200) {
                        this.loginErrorMsg = err.response.data;
                    } else {
                        this.loginErrorMsg = err.response.data.error;
                    }
                    
                })
            }
        }
    }
}
</script>

<style>
#login-button-container {
    display: flex;
    justify-content: center;
}

.ContainerMsgErr{
    display: flex;
    justify-content: center;
    color: rgb(212, 0, 0);
}

.loginMsgErr {
    width: 50%;
}
</style>