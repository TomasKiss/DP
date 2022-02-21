<template>
  <div class="namespaces">
    <div class="">
      <PrimeMenu/>
    </div>
      <Toast :position="smallToast ? 'top-right' : 'bottom-center'">
        <template v-if="!smallToast" #message="slotProps">
            <div class="p-d-flex p-flex-column">
                <div class="p-text-center">
                    <i class="pi pi-exclamation-triangle" style="font-size: 3rem"></i>
                    <h4>Are you sure you want to remove this namespace?</h4>
                    <p></p>
                </div>
                <div class="p-grid p-fluid">
                    <div class="p-col-6">
                        <Button class="p-button-success" label="Yes" @click="onConfirmRemove(slotProps.message.prefix)" />
                    </div>
                    <div class="p-col-6">
                        <Button class="p-button-secondary" label="No" @click="onRejectRemove" />
                    </div>
                </div>
            </div>
        </template>
    </Toast>
    <NamespacesMaintenance @update-toast="updateToast" :prefix="prefix"/>
  </div>
</template>

<script>
// @ is an alias to /src
import PrimeMenu from "@/components/PrimeMenu.vue"
import NamespacesMaintenance from "@/components/NamespacesMaintenance.vue"
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import {config} from '../../config';

export default {
  name: 'NamespacesPage',
  components: {
    PrimeMenu,
    Toast,
    Button,
    NamespacesMaintenance
  },
  data() {
    return {
      smallToast: true,  
      prefix: '',
    }
  },
  methods: {
    updateToast(e){
        
      if(e[0] == "confirmRemove"){
        this.smallToast = false;  
        this.$toast.add({severity: 'warn', prefix: e[1]});
      } else if (e[0] == "removeAll"){
        this.$toast.removeAllGroups();
      } else if (e[0] == "error"){
        this.smallToast = true;
        this.$toast.add({severity:'error', summary: 'Error', detail:e[1], life: 3000});
      } else if (e[0] == "onConfirmRemove"){
        this.smallToast = true;  
        this.$toast.add({severity:'success', summary: 'Successfully removed', detail:'Namespaces was removed.', life: 3000});
      } else if (e[0] == "closeCreateModal"){
        this.smallToast = true;
        this.$toast.add({severity:'success', summary: 'Success creation', detail:'New namespaces created', life: 3000});
      } else if (e[0] == "closeEditModal"){
        this.smallToast = true;
        this.$toast.add({severity:'success', summary: 'Successful edit', detail:'Namespace successfully updated!', life: 3000});
      }
    },
    onConfirmRemove(prefix){
      this.prefix = prefix;
    },
    onRejectRemove(){
      this.$toast.removeAllGroups();
      // this.smallToast = true;  
    }
  }
}
</script>

<style>

</style>