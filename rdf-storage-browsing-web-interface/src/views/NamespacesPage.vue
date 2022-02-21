<template>
  <div class="namespaces">
    <div class="">
      <PrimeMenu/>
    </div>
    <NamespacesMaintenance/>
  </div>
</template>

<script>
// @ is an alias to /src
import PrimeMenu from "@/components/PrimeMenu.vue"
import NamespacesMaintenance from "@/components/NamespacesMaintenance.vue"

export default {
  name: 'NamespacesPage',
  components: {
    PrimeMenu,
    NamespacesMaintenance
  },
  data() {
    return {

    }
  },

}
</script>

<style>

</style>