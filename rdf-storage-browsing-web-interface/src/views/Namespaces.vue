<template>
  <div class="namespaces">
    <div class="">
      <PrimeMenu/>
    </div>
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
                <template #body="">
                      <Button @click="openEditModal(position)" class="p-button-sm margin-right p-button-warning" v-tooltip.right="'Edit'">
                        <i class="pi pi-pencil"></i>
                        </Button>
                      <Button @click="confirmRemove" class="p-button-sm p-button-danger" v-tooltip.right="'Remove'">
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
                    <h4>{{slotProps.message.summary}}</h4>
                    <p>{{slotProps.message.detail}}</p>
                </div>
                <div class="p-grid p-fluid">
                    <div class="p-col-6">
                        <Button class="p-button-success" label="Yes" @click="onConfirm" />
                    </div>
                    <div class="p-col-6">
                        <Button class="p-button-secondary" label="No" @click="onReject" />
                    </div>
                </div>
            </div>
        </template>
    </Toast>

    <Dialog header="New Namespace" v-model:visible="displayCreateModal" :style="{width: '50vw'}" :position="position" :modal="true">
      <div class="p-fluid">
          <div class="p-field">
              <label for="prefix">Prefix</label>
              <InputText id="prefix" type="text" />
          </div>
          <div class="p-field">
              <label for="namespace">Namespace</label>
              <InputText id="namespace" type="text" />
          </div>
      </div>
      <template #footer>
          <Button label="Create" icon="pi pi-check" @click="closeCreateModal" autofocus />
      </template>
    </Dialog>

    <Dialog header="Edit Namespace" v-model:visible="displayEditModal" :style="{width: '50vw'}" :position="position" :modal="true">
      <div class="p-fluid">
          <div class="p-field">
              <label for="prefix">Prefix</label>
              <InputText id="prefix" type="text" />
          </div>
          <div class="p-field">
              <label for="namespace">Namespace</label>
              <InputText id="namespace" type="text" />
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
      data: null,
      tableData: {"data":[]},
      displayCreateModal: false,
      displayEditModal: false,
      position:'top'
    }
  },
  async mounted() {
    this.queryAllNamespaces()
  },
  methods:{
    confirmRemove(){
      this.$toast.add({severity: 'warn', summary: 'Are you sure?', detail: 'Proceed to confirm', group: 'bc'});
    },
    onConfirm() {
      this.$toast.removeGroup('bc');
    },
    onReject() {
      this.$toast.removeGroup('bc');
    },
    openCreateModal(position) {
      this.position = position;
      this.displayCreateModal = true;
    },
    openEditModal(position) {
      this.position = position;
      this.displayEditModal = true;
    },
    closeCreateModal() {
      this.displayCreateModal = false;
    },
    closeEditModal() {
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