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
                <Button @click="alert" class="p-button-sm p-button-info size" v-tooltip.right="'Create new namespace'">
                  <i class="pi pi-plus"></i>
                  </Button>
              </div>
            </div>
      </div>  
      <div class="p-col-12" style="">

          <!-- <table v-if="data" class="">
            <th class="p-col-4">Prefix</th>  
            <th class="p-col-4">Namespace</th>  
            <th class="p-col-4">Options</th>
            <tr class="" v-for="i in data.results.bindings.length" :key="i">
              <td class="p-col-4">{{data.results.bindings[i-1].prefix.value}}</td>  
              <td class="p-col-4">{{data.results.bindings[i-1].namespace.value}}</td>  
              <td class="p-col-4">
                <tr>
                  <td><button>Del</button></td>
                  <td><button>Set</button></td>
                </tr>
                </td>  

            </tr>  
          </table> -->
          <DataTable  :value="tableData.data" responsiveLayout="scroll">
              <Column  field="prefix" header="Prefix"></Column>
              <Column  field="namespace" header="Namespace"></Column>
              <Column  header="Options"> 
                <template #body="">
                      <Button @click="alert" class="p-button-sm margin-right p-button-warning" v-tooltip.right="'Edit'">
                        <i class="pi pi-pencil"></i>
                        </Button>
                      <Button @click="alert" class="p-button-sm p-button-danger" v-tooltip.right="'Remove'">
                        <i class="pi pi-trash"></i>
                        </Button>

                </template>
              </Column>
          </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import PrimeMenu from "@/components/PrimeMenu.vue"
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

export default {
  name: 'Namespaces',
  components: {
    PrimeMenu,
    DataTable,
    Column,
    Button
  },
  data() {
    return {
      data: null,
      tableData: {"data":[]}
    }
  },
  async mounted() {
    this.queryAllNamespaces()
  },
  methods:{
    alert(){
      console.log("click")
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
      // console.log(this.data)  
      // console.log(this.data.head.vars[0])
      // console.log(this.data.head.vars[1])

      // console.log(this.data.results.bindings[0].namespace.value)
      // console.log(this.data.results.bindings.length)


        for (let index = 0; index < this.data.results.bindings.length; index++) {
          this.tableData.data.push({
            'prefix': this.data.results.bindings[index].prefix.value,
            'namespace': this.data.results.bindings[index].namespace.value
            
          })
          
        }
        // console.log(this.tableData)
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
  /* width: 4.5vw; */
  margin: 25px 0 0 !important;
}
</style>