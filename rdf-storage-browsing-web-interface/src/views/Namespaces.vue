<template>
  <div class="namespaces">
    <div class="">
      <PrimeMenu/>
    </div>
    <Toast/>
    <div class="p-grid p-flex-column main">
      <div class="p-col-12">
            <div class="main p-grid">
              <div class="p-col">
                <h1>Namespaces </h1>
              </div>
              <div class="p-col-fixed">
                <Button @click="openCreateModal(position)" class="p-button-sm p-button-info size" v-tooltip.right="'Create new namespace'">
                  <i class="pi pi-plus"></i>
                  </Button>
              </div>
            </div>
      </div>  
      <div class="p-col-12" style="">
          <DataTable  :value="tableData.data" responsiveLayout="scroll">
              <Column  field="prefix" header="Prefix"></Column>
              <Column  field="namespace" header="Namespace"></Column>
              <Column  header="Options"> 
                <template #body="slotProps">
                      <Button @click="openEditModal(position,slotProps.data.prefix)" class="p-button-sm margin-right p-button-warning" v-tooltip.right="'Edit'">
                        <i class="pi pi-pencil"></i>
                        </Button>
                      <Button @click="confirmRemove(slotProps.data.prefix)" class="p-button-sm p-button-danger" v-tooltip.right="'Remove'">
                        <i class="pi pi-trash"></i>
                        </Button>

                </template>
              </Column>
          </DataTable>
      </div>
    </div>
    <Toast position="bottom-center" group="bc">
        <template #message="slotProps">
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

    <Dialog header="New Namespace" v-model:visible="displayCreateModal" :style="{width: '50vw'}" :position="position" :modal="true">
      <div class="p-fluid">
          <div class="p-field">
              <label for="prefix">Prefix</label>
              <InputText id="prefixC" type="text" v-model="newNSprefix"/>
          </div>
          <div class="p-field">
              <label for="namespace">Namespace</label>
              <InputText id="namespaceC" type="text" v-model="newNSname"/>
          </div>
      </div>
      <template #footer>
          <Button label="Create" icon="pi pi-check" @click="closeCreateModal" autofocus />
      </template>
    </Dialog>

    <Dialog :header="`Edit namespace for prefix: ${prefixEditNS}`" v-model:visible="displayEditModal" :style="{width: '50vw'}" :position="position" :modal="true">
      <div class="p-fluid">
          <div class="p-field">
              <label for="namespace">New Namespace</label>
              <InputText id="namespaceE" type="text" v-model="editedNSname"/>
          </div>
      </div>
      <template #footer>
          <Button label="Save" icon="pi pi-check" @click="closeEditModal" autofocus />
      </template>
    </Dialog>
    

  </div>
</template>

<script>
// @ is an alias to /src
import PrimeMenu from "@/components/PrimeMenu.vue"
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

export default {
  name: 'Namespaces',
  components: {
    PrimeMenu,
    DataTable,
    Column,
    Button,
    Toast,
    Dialog,
    InputText
  },
  data() {
    return {
      // namesapce info for repository
      data: null,
      tableData: {"data":[]},
      // modal properties
      displayCreateModal: false,
      displayEditModal: false,
      position:'top',
      // namespace creation data
      newNSname:'',
      newNSprefix:'',
      // prefix for wich the namespace will be edited
      prefixEditNS:'',
      editedNSname:''
    }
  },
  async mounted() {
    this.queryAllNamespaces()
  },
  methods:{
    // open toast to confirm removal of namespace
    confirmRemove(prefixToRemove){
      this.$toast.add({severity: 'warn', prefix: prefixToRemove, group: 'bc'});
    },
    // removal of namespace after confirmation
    async onConfirmRemove(prefixToRemove) {
      const res = await fetch('http://127.0.0.1:8080/rdf4j-server/repositories/1/namespaces/'+prefixToRemove,{
        method: 'DELETE',
      })
      .then(
        this.$toast.add({severity:'success', summary: 'Successfully removed', detail:'Namespaces was removed.', life: 3000}),
        this.tableData.data = this.tableData.data.filter(item => item.prefix != prefixToRemove)
      )
      .catch(error =>
        this.$toast.add({severity:'error', summary: 'Error', detail:error, life: 3000})
      )
      this.$toast.removeGroup('bc')
    
    },
    // removal of namespace was rejected, close toast
    onRejectRemove() {
      this.$toast.removeGroup('bc');
    },
    // opening and positioning modal for namespace creation
    openCreateModal(position) {
      this.position = position;
      this.displayCreateModal = true;
    },
    // opening and positioning modal for namespace edition
    openEditModal(position,prefix) {
      this.position = position;
      this.prefixEditNS = prefix;
      this.editedNSname = this.tableData.data[this.tableData.data.findIndex(item => item.prefix === this.prefixEditNS)].namespace;
      this.displayEditModal = true;
    },
    // Function to close modal and create new namespace in repository
    async closeCreateModal() {
      if(this.newNSname !== '' && this.newNSprefix !== ''){
        // TODO: Controll if namespace/prefix already exists ???
        // TODO: Controll if namespace/prefix correct format ???

        const res = await fetch('http://127.0.0.1:8080/rdf4j-server/repositories/1/namespaces/'+this.newNSprefix,{
          method: 'PUT',
          headers:{
            'Content-Type': 'text/plain'
          },
          body:this.newNSname  
        }).then(
          this.$toast.add({severity:'success', summary: 'Success creation', detail:'New namespaces created', life: 3000}),
          this.tableData.data.push({
            'prefix': this.newNSprefix,
            'namespace': this.newNSname
          }),
          // clearing inputtext values
          this.newNSname = '',
          this.newNSprefix = '',

        ).catch(error =>
          this.$toast.add({severity:'error', summary: 'Error', detail:error, life: 3000})
        )
        
        this.displayCreateModal = false;
      }

    },
    // function to close edit modal and execute update of the given namespace
    async closeEditModal() {
      // TODO: Controll if namespace is given???
      if(this.prefixEditNS !== ''){
          const res = await fetch('http://127.0.0.1:8080/rdf4j-server/repositories/1/namespaces/'+this.prefixEditNS,{
          method: 'PUT',
          headers:{
            'Content-Type': 'text/plain'
          },
          body:this.editedNSname 
        }).then(
          this.$toast.add({severity:'success', summary: 'Successfull edit', detail:'Namespace successfully updated!', life: 3000}),
          this.tableData.data[this.tableData.data.findIndex(item => item.prefix === this.prefixEditNS)].namespace = this.editedNSname,

          // clearing inputtext values
          this.prefixEditNS = '',
          this.editedNSname = '',

        ).catch(error =>
          this.$toast.add({severity:'error', summary: 'Error', detail:error, life: 3000})
        )
      }

      this.displayEditModal = false;
    },
    async queryAllNamespaces(){
      this.data = await fetch('http://127.0.0.1:8080/rdf4j-server/repositories/1/namespaces', {
            method: 'GET',
            headers: {
              'Accept':'application/json',
            },
          })
          .then(res => {
            return res.json()})
          .catch((error) => console.log(error))

        for (let index = 0; index < this.data.results.bindings.length; index++) {
          this.tableData.data.push({
            'prefix': this.data.results.bindings[index].prefix.value,
            'namespace': this.data.results.bindings[index].namespace.value
            
          })
          
        }
    }
  }
}
</script>

<style>
.main{
  margin: 0 10vw !important;
}
.margin-right{
  margin-right: 10px !important;
}

.size{
  margin: 25px 0 0 !important;
}
</style>