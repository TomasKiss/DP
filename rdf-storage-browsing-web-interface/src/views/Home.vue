<template>
  <div class="home">
    <div class="">
      <PrimeMenu/>
    </div>
    <MainComponent/>
  </div>
</template>

<script>
// @ is an alias to /src
import PrimeMenu from "@/components/PrimeMenu.vue"
import MainComponent from "@/components/MainComponent.vue"

export default {
  name: 'Home',
  components: {
    PrimeMenu,
    MainComponent
  },
  data() {
    return {

    }
  },

}
</script>

<style>
.main{
  margin: 0 10vw;
}
</style>