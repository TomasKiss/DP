<template>
  <div>
    <div class="">
        <PrimeMenu/>
    </div>
    <div class="main p-grid p-flex-column">
        <div class="p-col">
           <InsertData/>
        </div>
    </div>
  </div>
  
</template>

<script>
import InsertData from "@/components/InsertData.vue";
import PrimeMenu from "@/components/PrimeMenu.vue";

export default {
    name: "InsertDataPage",
    components: {
        InsertData,
        PrimeMenu
    },
    data() {
        return {
            
        }
    },
}
</script>
