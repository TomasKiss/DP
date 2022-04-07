<template>
  <div class="namespaces">
    <div class="">
    <Toast></Toast>
    <ConfirmDialog></ConfirmDialog>
    <Dialog header="New Namespace" v-model:visible="displayCreateModal" :style="{width: '50vw'}" :position="position" :modal="true">
      <div class="p-fluid">
          <div class="p-field">
              <label for="prefix">Prefix</label>
              <InputText id="prefixC" type="text" v-model="newNSprefix" :class="{'p-invalid': prefixEmpty && submittedDialog}"/>
              <small v-show="prefixEmpty && submittedDialog" class="p-error">Prefix is required.</small>
          </div>
          <div class="p-field">
              <label for="namespace">Namespace</label>
              <InputText id="namespaceC" type="text" v-model="newNSname" :class="{'p-invalid': namespaceEmpty && submittedDialog}"/>
              <small v-show="namespaceEmpty && submittedDialog" class="p-error">{{errorText}}</small>
          </div>
      </div>
      <template #footer>
          <Button label="Create" icon="pi pi-check" @click="closeCreateModal" autofocus/>
      </template>
    </Dialog>

    <Dialog :header="`Edit namespace for prefix: ${prefixEditNS}`" v-model:visible="displayEditModal" :style="{width: '50vw'}" :position="position" :modal="true">
      <div class="p-fluid">
          <div class="p-field">
              <label for="namespace">New Namespace</label>
              <InputText id="namespaceE" type="text" v-model="editedNSname" :class="{'p-invalid': namespaceEmpty && submittedDialog}"/>
              <small v-show="namespaceEmpty && submittedDialog" class="p-error">{{errorText}}</small>
          </div>
      </div>
      <template #footer>
          <Button label="Save" icon="pi pi-check" @click="closeEditModal" autofocus/>
      </template>
    </Dialog>
    
    </div>
    <div v-if="!loading">
      <div class="p-grid p-flex-column main">
        <div class="p-col-12">
              <div class="main p-grid">
                <div class="p-col">
                  <h1>Prefix declarations </h1>
                </div>
                <div class="p-col-fixed">
                  <Button @click="openCreateModal(position)" class="p-button-sm p-button-info size" v-tooltip.right="'Create new namespace'">
                    <i class="pi pi-plus"></i>
                  </Button>
                </div>
              </div>
        </div>  
        <div class="p-col-12" style="">
            <DataTable  :value="tableData.data" responsiveLayout="scroll"
            :paginator="true" :rows="10"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10,20,50]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
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
    </div>
    <div v-else>
      <div class="">
        <h1>Fetching Data</h1>
      </div>
      <img :src="require('../assets/hourglass.gif')" alt="" class=""/>
    </div>


  </div>
</template>

<script>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
let config = require('../config.js');
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

export default {
  name: 'NamespacesMaintenance',
  props : ['prefix'],
  components: {
    DataTable,
    Column,
    Button,
    Dialog,
    InputText,
    ConfirmDialog,
    Toast
  },
  data() {
    return {
      // namespace info for repository
      allNamespaces: null,
      tableData: {"data":[]},
      // modal properties
      displayCreateModal: false,
      displayEditModal: false,
      position:'top',
      // namespace creation data
      newNSname:'',
      newNSprefix:'',
      // prefix for which the namespace will be edited
      prefixEditNS:'',
      editedNSname:'',
      loading: true,
      // if dialog was submitted
      submittedDialog: false,
      // if prefix/namespace input was not filled
      prefixEmpty: false,
      namespaceEmpty: false,
      errorText: 'Namespace is required.', 
      url: config.server_url+'api/r/'+this.$route.params.repo+'/repository/namespaces/'
    }
  },
  async mounted() {
    this.loading = true;
    this.queryNameSpaces();
    this.loading = false;
  },    
  methods:{
    // open toast to confirm removal of namespace
    confirmRemove(prefixToRemove){
      // this.$toast.add({severity: 'warn', prefix: prefixToRemove});
      this.$confirm.require({
          message: 'Do you want to delete "'+ prefixToRemove.toUpperCase() + '"?',
          header: 'Delete Confirmation',
          icon: 'pi pi-info-circle',
          position: 'bottom',
          accept: () => {
            this.onConfirmRemove(prefixToRemove);
          },
          reject: () => {
            this.$toast.add({severity:'error', summary:'Rejected', detail:'You have rejected', life: 3000});
          }
      });
    },
    // removal of namespace after confirmation
    async onConfirmRemove(prefixToRemove){
      let result = await this.$root.apiClient.removeNamespaceFromRepo(this.url, prefixToRemove);
      
      if(result.ok) {
        this.$toast.add({severity:'success', summary: 'Successfully removed', detail:'Namespaces was removed.', life: 3000});
        this.tableData.data = this.tableData.data.filter(item => item.prefix != prefixToRemove);
      } else {
        let errMsg = await result.json();
        this.$toast.add({severity:'error', summary: 'Error', detail: errMsg.message, life: 3000});
      }
    
    },
    // opening and positioning modal for namespace creation
    openCreateModal(position){
      this.position = position;
      this.displayCreateModal = true;
    },
    // opening and positioning modal for namespace edition
    openEditModal(position,prefix){
      this.position = position;
      this.prefixEditNS = prefix;
      this.editedNSname = this.tableData.data[this.tableData.data.findIndex(item => item.prefix === this.prefixEditNS)].namespace;
      this.displayEditModal = true;
    },
    // Function to close modal and create new namespace in repository
    async closeCreateModal(){
      this.submittedDialog = true;
      // control if needed input is given and if namespace has correct format
      if(this.newNSname !== '' && this.newNSprefix !== '' && this.newNSname.match(/(http(s){0,1}:\/\/)\w+/g)){
        // control if namespace/prefix already exists
        if(this.tableData.data.some(item => item.prefix === this.newNSprefix || item.namespace === this.newNSname)){
          this.$toast.add({severity:'error', summary: 'Error', detail: 'Prefix/Namespace already exists!', life: 3000})
        } else {
          // if namespace/prefix doesn't exists -> create
          let result = this.$root.apiClient.createNamespace(this.url, this.newNSprefix, this.newNSname);

          if(result.ok){
            this.$toast.add({severity:'success', summary: 'Success creation', detail:'New namespaces created', life: 3000});
            this.tableData.data.push({
              'prefix': this.newNSprefix,
              'namespace': this.newNSname
            });
            // clearing inputtext values
            this.newNSname = '';
            this.newNSprefix = '';
          } else {
            let errMsg = await result.json();
            this.$toast.add({severity:'error', summary: 'Error', detail: errMsg.message, life: 3000});
          }
          
          this.displayCreateModal = false;
          this.prefixEmpty = false;
          this.namespaceEmpty = false;
          this.submittedDialog = false;
        }
      } else {
        this.prefixEmpty =  this.newNSprefix !== '' ? false : true;
        if(!this.newNSname.match(/(http(s){0,1}:\/\/)\w+/g) && this.newNSname !== ''){
          this.errorText = 'Not correct format of namespace.'
        } else {
          this.errorText = 'Namespace is required.';
        }
        this.namespaceEmpty = this.newNSname !== '' && this.newNSname.match(/(http(s){0,1}:\/\/)\w+/g) ? false : true;
      }

    },
    // function to close edit modal and execute update of the given namespace
    async closeEditModal(){

      this.submittedDialog = true;
      // control if namespace is given and already exists
      let exists = this.tableData.data.some(item => item.namespace === this.editedNSname && item.prefix !== this.prefixEditNS);
     
      if(this.editedNSname !== '' && this.editedNSname.match(/(http(s){0,1}:\/\/)\w+/g) && !exists){
          let result = await this.$root.apiClient.createNamespace(this.url, this.prefixEditNS, this.editedNSname);
          
          if(result.ok){
            this.$toast.add({severity:'success', summary: 'Successful edit', detail:'Namespace successfully updated!', life: 3000});
            this.tableData.data[this.tableData.data.findIndex(item => item.prefix === this.prefixEditNS)].namespace = this.editedNSname;

            // clearing input text values
            this.prefixEditNS = '';
            this.editedNSname = '';

          } else {
            let errMsg = await result.json();
            this.$toast.add({severity:'error', summary: 'Error', detail:errMsg.message, life: 3000})
          }

        this.namespaceEmpty = false;
        this.submittedDialog = false;
        this.displayEditModal = false;
      } else {
        if(!this.editedNSname.match(/(http(s){0,1}:\/\/)\w+/g) && this.editedNSname !== ''){
          this.errorText = 'Not correct format of namespace.'
        } else if(exists){
          this.errorText = 'Namespace already exists.';
        } else {
          this.errorText = 'Namespace is required.';
        }
        this.namespaceEmpty = true;
      }

    },
    // function to query all namespaces of the given repository
    async queryNameSpaces(){

      let data = await this.$root.apiClient.queryAllNamespaces(this.$route.params.repo); 
      
      if(data.ok){
        this.allNamespaces = await data.json();
        // Storing namespaces with corresponding prefixes
        for (let index = 0; index < this.allNamespaces.results.bindings.length; index++) {
          this.tableData.data.push({
            'prefix': this.allNamespaces.results.bindings[index].prefix.value,
            'namespace': this.allNamespaces.results.bindings[index].namespace.value
          })   
        }
      } else {
        this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "Error happened during fetch of all namespaces!",
          });
      }
    },
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