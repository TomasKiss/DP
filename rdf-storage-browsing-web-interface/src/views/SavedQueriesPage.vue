<template>
    <div>
    <div class="">
        <PrimeMenu/>
    </div>
    <div class="main p-grid p-flex-column">
        <div class="p-col-12">
            <div class="main p-grid">
            <div class="p-col">
                <h1>Saved queries </h1>
            </div>
            </div>
        </div>  
        <div class="p-col-12">
            <SavedQueries/>
        </div>
    </div>
  </div>
</template>

<script>
import PrimeMenu from "@/components/PrimeMenu.vue";
import SavedQueries from "@/components/SavedQueries.vue";


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
