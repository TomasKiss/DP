<template>
  <div class="namespaces">
    <NamespacesMaintenance/>
  </div>
</template>

<script>
// @ is an alias to /src
import NamespacesMaintenance from "@/components/NamespacesMaintenance.vue"

export default {
  name: 'NamespacesPage',
  components: {
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