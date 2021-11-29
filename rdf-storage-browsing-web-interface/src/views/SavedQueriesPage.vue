<template>
    <div>
    <div class="">
        <PrimeMenu/>
    </div>
    <div class="main p-grid p-flex-column">
        <div class="p-col-12">
              <div class="main p-grid">
                <div class="p-col">
                  <h1>Prefix declarations </h1>
                </div>
              </div>
        </div>  
        <div class="p-col-12" style="">
            <!-- Saved Queries component -->
            <SavedQueries />
        </div>
    </div>
  </div>
</template>

<script>
import PrimeMenu from "@/components/PrimeMenu.vue"
import SavedQueries from "@/components/SavedQueries.vue"


export default {
    name: "SavedQueriesPage",
    components: {
        PrimeMenu,
        SavedQueries
    },
    data() {
        return {
            
        }
    },
}
</script>

<style>

</style>