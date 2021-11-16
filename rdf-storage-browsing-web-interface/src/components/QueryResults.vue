<template>
<div v-if="showUserQueryRes">
  <ResourceExplorer :resource="resource" :prefixes="result.data[1]" ></ResourceExplorer>
</div>

<div v-else>
    <div v-if="!askQueryRes">
        <DataTable :value="computedResult" responsiveLayout="scroll" 
          :paginator="true" :rows="10"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          :rowsPerPageOptions="[10,20,50]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          filterDisplay="row"
          v-model:filters="filters"
          >
          <!-- <template #header>
              <div class="p-d-flex p-jc-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined" @click="clearFilter()"/>
              </div>
            </template> -->
            <template #empty>
              No data found.
            </template>
            <template #loading>
              Loading data. Please wait.
            </template>
            <Column v-for="(col,i) in columns" :field="col" :header="col" :key="i" :filterField="`${col}f`">
            <template #body="slotProps">
                  <Button @click="exploreResource(slotProps.data[col].tol)" 
                    v-tooltip.bottom="slotProps.data[col].tol" class="p-button-link">{{slotProps.data[col].val}}</Button>
              </template>
              <template #filter="{filterModel,filterCallback}">
                  <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by ${filterModel.matchMode}`" v-tooltip.top.focus="'Hit enter key to filter'"/>
              </template>
            </Column>
        </DataTable>
    </div>
    <div v-else-if="askRes != ''">
        <!--Boolean result -->

        <h3>The result of query is: {{askRes ? "Yes" : "No"}}</h3>
        <i v-if="askRes" class="pi pi-check" style="fontSize: 2rem; color:green; font-weight:bold"></i>
        <i v-else class="pi pi-times" style="fontSize: 2rem; color:red; font-weight:bold"></i>

    </div>
</div>


</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ResourceExplorer from './ResourceExplorer.vue'
import {FilterMatchMode,FilterOperator} from 'primevue/api';

export default {
    name: 'QueryResults',
    props: ['result'],
    components:{
      DataTable,
      Column,
      Button,
      ResourceExplorer,
      InputText,
      FilterMatchMode,
    },
    data() {
        return {
          // data for the rows in the table
          computedResult: [],
          // name of columns in the table
          columns:[],
          // show the table if data is available
          showUserQueryRes: false,
          // resource clicked by user for further exploration
          resource: null, 
          filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
          },
          // the query was typ of ASK (boolean result)
          askQueryRes: false,   
          askRes: '',
        }
    },
    mounted() {
      console.log("filters",this.filters);
      this.processResponse(); 
    },
    methods: {
      
      // function activating resource exploration component
      exploreResource(resource){
        this.filters = {};
        this.filters['global'] = { value: null, matchMode: FilterMatchMode.CONTAINS };

        this.resource = resource;
        console.log(this.resource, resource);
        if(this.resource !== '')
          this.showUserQueryRes = true;
      },
      clearFilter(){
        this.filter = {};
      },
      processResponse(){
        if(this.result) {
          // hide table and ask result
          this.showUserQueryRes = false;

          if('boolean' in this.result.data[0]){
            // ASK query 
            this.askUserQueryRes = true;
            this.askRes = this.result.data[0].boolean;

          } else {
            // NOT ASK query
            this.askUserQueryRes = false;

            // store column headers 
            this.result.data[0].head.vars.forEach((item) => {
              this.columns.push(
                item
              );
              this.filters[item+'f'] = {value: null, matchMode: FilterMatchMode.CONTAINS};  
            })
            console.log(this.filters)
            // loop processing response and transforming it to row data  
            this.result.data[0].results.bindings.forEach((element) => {
              let answers = {};
              // process one rowe data
              this.columns.forEach((item) => {
                if(element[item]){
                  // for column data store : value(with prefix), tooltip(with full URI), type(literal/uri/...)
                  let word = {'val': element[item].value, 'tol': element[item].value, 'type': element[item].type};

                  // replace namespace with prefix if present
                  this.result.data[1].forEach((el) => {
                    word.val = word.val.replace(el.namespace, el.prefix+':');      
                  })
                  
                  // transform value if literal is the actual item, add datatype to value
                  if(element[item].type !== 'uri' && element[item].datatype){
                    
                    word.tol = '"' +word.val+'"^^xsd:'+element[item].datatype.substring(element[item].datatype.indexOf("#")+1);;
                  }
                  
                  // store column data
                  answers[item] = word;  
                  answers[item+'f'] = word.val;  

                }
              })
              // store row data
              this.computedResult.push(answers);
            })
            console.log("new final result: ",this.columns, this.computedResult);
          }  
        }  
      }
    }
}
</script>

<style>
.p-button{
  text-align: left !important;
}
</style>