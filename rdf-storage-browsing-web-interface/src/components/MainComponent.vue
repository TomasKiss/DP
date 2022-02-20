<template>
  <div class="main p-grid p-flex-column">
    <div class="p-col">
      <RdfEditor @resultReturn="resultsHandler" @loadingResult="loadingStart"/>
    </div>
    <div class="p-col">
      <!-- show results if they are ready -->
      <QueryResults v-if="queryResult && !loading" :result="queryResult"/>
      <!-- show spinner when the data is not ready yet -->
      <img v-else-if="loading" :src="require('../assets/hourglass.gif')" alt="" class="" />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import RdfEditor from "./RdfEditor.vue"
import QueryResults from "./QueryResults.vue"

export default {
  name: 'MainComponent',
  components: {
    RdfEditor,
    QueryResults
  },
  data() {
    return {
      queryResult:'',
      loading: false,
    }
  },
  methods: {
    resultsHandler(e){
      this.queryResult = e;
    },
    loadingStart(e){
      this.loading = e;
    }
  }
}
</script>

<style>
.main{
  margin: 0 10vw;
}
</style>