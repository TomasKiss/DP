<template>
    <Menubar :model="items">
      <template #start>
          <img alt="logo" src="../../public/favicon_package_v0.16/favicon-32x32.png" height="40" class="p-mr-2">
      </template>
      <template #end>
      </template>
  </Menubar>
</template>

<script>
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext'

export default {
  name: "PrimeMenu",
  components:{
      Menubar,
      InputText
  },
  data() {
    return {
      items:[
        {
          label: 'Editor',
          icon: 'pi pi-pencil',
          to:{name: 'Home'}      
        },
        {
          label: 'Prefix declarations',
          icon: 'pi pi-list',
          to:{name: 'NamespacesPage'}      
        },
        {
          label: 'Saved queries',
          icon: 'pi pi-question-circle',
          to:{name: 'SavedQueriesPage'}      
        },
        {
          label: 'Insert data',
          icon: 'pi pi-upload',
          to:{name: 'InsertDataPage'}      
        },
      ],
    }
  },
}
</script>
