<template>
    <Menubar :model="items">
      <template #start>
          <img alt="logo" src="../../public/favicon_package_v0.16/favicon-32x32.png" height="40" class="p-mr-2">
      </template>
      <template #end>
          <!-- <InputText placeholder="Search" type="text" /> -->
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
            // {
            //   label: 'Repositories',
            //   icon: 'pi pi-folder',
            //   to:{name: 'Repositories'}        
            // },
            {
              label: 'Editor',
              icon: 'pi pi-pencil',
              to:{name: 'Home'}      
            },
            {
              label: 'Namespaces',
              icon: 'pi pi-list',
              to:{name: 'Namespaces'}      
            }
        ],
      }
    },
}
</script>

<style>

</style>