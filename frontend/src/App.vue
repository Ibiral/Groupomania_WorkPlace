<template>
  <div id="app">
    <Header />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>

// Header and Footer are displayed on every page of the app

import Header from './components/Header';
import Footer from './components/Footer';

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>


#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: 100vh;
}

body {

  background-color: #eee;
  color: #222;
  min-height: 100vh;
  max-width: 100%;
  overflow-x: hidden;
  background-color: #f05454;
  margin-bottom: 30px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 1.6em;
  color: white;
}

h2 {
  text-align: left;
  font-size: 1.5em;
  margin-bottom: 3%;
}

h3 {
  font-size: 1.2em ;
}

#form {
  max-width: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
  background-color: #30475e;
  color: white;
  border-radius: 50px;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2%;
  padding: 3%;
}

.form-title {
  margin-bottom: 3%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}

.form-input {
  display: flex;
  flex-direction: column;
  margin: 0 0 1rem 0;
}
label, input, textarea {
  box-sizing: border-box;
  justify-content: space-between;
  font-size: 1.1rem;
}
label {
  text-align: left;
}

.error-message {
    flex: 0 0 100%;
    margin-left: 30%;
    color: red;
}

@media (max-width: 768px) {
 h2 {
  font-size: 1.2em;
}
}

@media (max-width: 480px) {
  #form {
  max-width: 80%;
}
 
} 
</style>
