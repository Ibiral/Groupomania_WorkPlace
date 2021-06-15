<template>
    <header>
        <router-link to="/wall" @click="scrollToTop"><img id="groupomania_logo" src="@/assets/images/icon-left-font-monochrome-white.svg" alt="groupomania-logo"></router-link>
        <nav v-show="userConnected">
            <button class="header-button" id="mon_profil_button" @click="goToProfile"><font-awesome-icon :icon="['fas', 'user']" /></button>
            <button class="header-button" id="logout_button" @click="logout"><font-awesome-icon :icon="['fas', 'power-off']" /></button>
        </nav>
    </header>
</template>

<script>
export default {
    name: 'Header',
    computed: {
      // Vérifier si l'utilisateur est connecté
      userConnected() {
        if(this.$route.path == "/signup" || this.$route.path == "/login" ) {
        return false
        } else {
        return true
        }
      }
    },
    methods: {
        // Déconnecter l'utilisateur, vider le localStorage et rediriger vers la page login
        logout() {
          localStorage.clear();
          this.$router.push('/login');
        },
        // Accéder au profil de l'utilisateur par l'utilisateur lui-même
        goToProfile() {
          this.$router.push('/myprofile');
        },
        scrollToTop() {
          window.scrollTo(0,0);
        }
    }
}
</script>

<style>
header {
  position: sticky;
  top: 0;
  z-index:200;
  background-color: #30475e;
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: Arial, Helvetica, sans-serif;
}

#groupomania_logo {
  margin-left: 5%;
  width: 55%;
  transition: all 0.2s ease;
  margin-top: 1%;
  margin-bottom: 1%;
}
#groupomania_logo:hover {
transform: scale(1.05);
}
nav {
  width: 10%;
  height: auto;
  padding: 1%;
  display: flex;
  justify-content: space-between;
}

.header-button {
  background-color: #335d88;
  color:#FFFFFF;
  border: none;
  border-radius: 10%;
  padding: 5%;
  width: auto;
  height: auto;
  font-size: 1.3em;
  cursor: pointer;
  outline: none;
  box-shadow: none;
  text-align: center;
  text-decoration: none;
  display: inline-block;

  transition: all 0.2s ease;
}
.header-button:focus {
  outline: none;
  box-shadow: none;
}
.header-button:hover {
  transform: scale(1.1);
}

button#logout_button {
    background-color: #da2f2f;
}

@media (max-width: 768px) {
  header {
    padding: 1%;
  }
  nav {
  width: 15%;
  }
} 

@media (max-width: 480px) {

  nav {
  width: 26%;
  }

  #groupomania_logo {
  width: 65%;
  }
} 

</style>