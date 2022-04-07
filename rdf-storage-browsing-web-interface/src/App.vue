<template>
  <router-view/>
</template>

<script>
import {ApiClient} from './components/ApiClient.js';

export default {
  name: 'app',
  data(){
   return {
    apiClient: null,
   }
  },
  created(){
    this.apiClient = new ApiClient();
  }
}
</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
