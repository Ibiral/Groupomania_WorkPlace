import Vue from 'vue';
// Import vue router
import VueRouter from 'vue-router';

// Importation des composants
import PostsWall from '../components/PostsWall.vue';
import Signup from '../components/Signup.vue';
import Login from '../components/Login.vue';
import MyProfile from '../components/MyProfile.vue';
import Post from '../components/Post.vue'
import CreatePost from '../components/CreatePost.vue'

Vue.use(VueRouter);

// Définir une url pour chaque composant
const routes = [
  {path: '/wall', component: PostsWall},
  {path: '/signup', component: Signup},
  {path: '/', component: Login, alias: '/login'},
  {path: '/myprofile', component: MyProfile},
  {path: '/post/:id', component: Post},
  {path: '/add', component: CreatePost}
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior() {
    return {x: 0, y: 0}
  }
})

export default router