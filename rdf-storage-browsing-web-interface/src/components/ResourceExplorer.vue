<template>
  <Toast />

   <div>
      <h3>Resource: {{res}}</h3>
   </div>
   <TabView :activeIndex="activePanel">
      <TabPanel header="Subject" :disabled="!tableData.subject.length">
         <DataTable  :value="tableData.subject" responsiveLayout="scroll"
         :paginator="true" :rows="10"
         paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
         :rowsPerPageOptions="[10,20,50]"
         currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
         filterDisplay="row"
         v-model:filters="filters"
         >
            <Column  header="Predicate" filterField="a_p_val"> 
               <template #body="slotProps">
                     <Button @click="fetchResData(slotProps.data.a_p_tol)" 
                        v-tooltip.bottom="slotProps.data.a_p_tol" :label="slotProps.data.a_p_val" class="p-button-link" />
               </template>
               <template #filter="{filterModel,filterCallback}">
               <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by ${filterModel.matchMode}`" v-tooltip.top.focus="'Hit enter key to filter'"/>
               </template>
            </Column>

            <Column  header="Object" filterField="a_o_val"> 
               <template #body="slotProps">
                     <Button @click="fetchResData(slotProps.data.a_o_tol)"
                        v-tooltip.bottom="slotProps.data.a_o_tol" :label="slotProps.data.a_o_val" class="p-button-link" />
               </template>
               <template #filter="{filterModel,filterCallback}">
               <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by ${filterModel.matchMode}`" v-tooltip.top.focus="'Hit enter key to filter'"/>
               </template>   
            </Column>

         </DataTable>
      </TabPanel>
      <TabPanel header="Predicate" :disabled="!tableData.predicate.length">
         <DataTable  :value="tableData.predicate" responsiveLayout="scroll"
         :paginator="true" :rows="10"
         paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
         :rowsPerPageOptions="[10,20,50]"
         currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
         filterDisplay="row"
         v-model:filters="filters"
         >
            <Column  header="Subject" filterField="b_s_val"> 
               <template #body="slotProps">
                     <Button @click="fetchResData(slotProps.data.b_s_tol)" 
                        v-tooltip.bottom="slotProps.data.b_s_tol" :label="slotProps.data.b_s_val" class="p-button-link" />
               </template>
               <template #filter="{filterModel,filterCallback}">
               <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by ${filterModel.matchMode}`" v-tooltip.top.focus="'Hit enter key to filter'"/>
               </template>
            </Column>

            <Column  header="Object" filterField="b_o_val"> 
               <template #body="slotProps">
                     <Button @click="fetchResData(slotProps.data.b_o_tol)"
                        v-tooltip.bottom="slotProps.data.b_o_tol" :label="slotProps.data.b_o_val" class="p-button-link" />
               </template>
               <template #filter="{filterModel,filterCallback}">
               <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by ${filterModel.matchMode}`" v-tooltip.top.focus="'Hit enter key to filter'"/>
               </template>
            </Column>

         </DataTable>
      </TabPanel>
      <TabPanel header="Object" :disabled="!tableData.object.length">
         <DataTable  :value="tableData.object" responsiveLayout="scroll"
         :paginator="true" :rows="10"
         paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
         :rowsPerPageOptions="[10,20,50]"
         currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
         filterDisplay="row"
         v-model:filters="filters"
         >
            <Column  header="Subject" filterField="c_s_val"> 
               <template #body="slotProps">
                     <Button @click="fetchResData(slotProps.data.c_s_tol)" 
                        v-tooltip.bottom="slotProps.data.c_s_tol" :label="slotProps.data.c_s_val" class="p-button-link" />
               </template>
               <template #filter="{filterModel,filterCallback}">
               <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by ${filterModel.matchMode}`" v-tooltip.top.focus="'Hit enter key to filter'"/>
               </template>
            </Column>

            <Column  header="Predicate" filterField="c_p_val"> 
               <template #body="slotProps">
                     <Button @click="fetchResData(slotProps.data.c_p_tol)"
                        v-tooltip.bottom="slotProps.data.c_p_tol" :label="slotProps.data.c_p_val" class="p-button-link" />
               </template>
               <template #filter="{filterModel,filterCallback}">
               <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" :placeholder="`Search by ${filterModel.matchMode}`" v-tooltip.top.focus="'Hit enter key to filter'"/>
               </template>
            </Column>

         </DataTable>
      </TabPanel>
   </TabView>

</template>

<script>
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
let config = require('../config.js');
import {FilterMatchMode,FilterOperator} from 'primevue/api';
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';

export default {
   name : 'ResourceExplorer',
   props : ['resource','prefixes'],
   components: {
      TabView,
      TabPanel,
      DataTable,
      Column,
      Button,
      InputText,
      FilterMatchMode,
      Toast
   },
   data() {
      return {
         // beginning of query text
         qStart : 'SELECT * {',
         // container for data presented in table    
         tableData : {
            'subject':[],
            'predicate':[],
            'object':[]
         },
         // tab panel headers 
         headers : ["Subject", "Predicate", "Object"],
         // resource which is currently examined   
         res : '',
         // id of active tab panel
         activePanel : 0,
         filters: {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            a_o_val: { value: null, matchMode: FilterMatchMode.CONTAINS },
            a_p_val: { value: null, matchMode: FilterMatchMode.CONTAINS },
            b_s_val: { value: null, matchMode: FilterMatchMode.CONTAINS },
            b_o_val: { value: null, matchMode: FilterMatchMode.CONTAINS },
            c_s_val: { value: null, matchMode: FilterMatchMode.CONTAINS },
            c_p_val: { value: null, matchMode: FilterMatchMode.CONTAINS },
         },
      }
   },
   async mounted() {
      this.res = this.resource;
      // fetching data to explore first resource
      await this.fetchResData(this.resource);
   },
   methods: {
      // function executing query to get data of all 
      // occurrences of chosen resource 
      async fetchResData(resource) {
         // create query 
         let queryText = this.createQuery(resource);   
         let queryToUrl = config.server_url+'api/r/'+this.$route.params.repo+'/repository/query';

         let data = await this.$root.apiClient.sendQueryToUrl(queryToUrl, queryText, "select", this);   

         if(data){
            // initialize needed variables
            this.tableData.subject = [];
            this.tableData.predicate = [];
            this.tableData.object = [];
            this.res = resource;
            this.activePanel = 0;

            // convert response to easier accessible data
            this.dataProcessing(data);
         } else {
            // show toast about no data found for the resource
            this.$toast.add({severity:'error', summary: 'Error', detail:`No data found for resource:\n ${resource} !`, life: 3000});
         }

      },
      
      // function creating text of the query
      createQuery(resource){
         // if the chosen resource is a literal with datatype
         // predicate can't be literal!
         if(resource.includes("^^xsd:")){
            return this.qStart + '{' + resource + "?a_p?a_o.}UNION"
            +"{?c_s?c_p"+ resource +".}}";
         } else {
            return this.qStart + '{<' + resource + ">?a_p?a_o.}UNION"
            +"{?b_s<" + resource + ">?b_o.}UNION"
            +"{?c_s?c_p<"+ resource +">.}}";
         }
      },

      // function transforming the response into other structured data
      dataProcessing(data){
         this.filters['global'] = { value: null, matchMode: FilterMatchMode.CONTAINS };   

         data.results.bindings.forEach((element) => {   
            // store data for first tab panel (predicate, object)
            if(element.a_p && element.a_o){
               let sub_word = {
                  'a_o_val': element.a_o.value,
                  'a_o_tol': element.a_o.value,
                  'a_o_type': element.a_o.type,
                  'a_p_val': element.a_p.value,
                  'a_p_tol': element.a_p.value,
                  'a_p_type': element.a_p.type
               }            
               // replace namespace with prefix if present
               this.prefixes.forEach((item) => {
                  sub_word.a_o_val = sub_word.a_o_val.replace(item.namespace, item.prefix+':');      
                  sub_word.a_p_val = sub_word.a_p_val.replace(item.namespace, item.prefix+':');      
               })  
               this.tableData.subject.push(sub_word);   
               this.filters['a_o_val'] = { value: null, matchMode: FilterMatchMode.CONTAINS };   
               this.filters['a_p_val'] = { value: null, matchMode: FilterMatchMode.CONTAINS }; 
            }

            // store data for second tab panel (subject, object)
            if(element.b_s && element.b_o){
               let pred_word = {
                  'b_o_val': element.b_o.value,
                  'b_o_tol': element.b_o.value,
                  'b_o_type': element.b_o.type,
                  'b_s_val': element.b_s.value,
                  'b_s_tol': element.b_s.value,
                  'b_s_type': element.b_s.type
               }            
            
               this.prefixes.forEach((item) => {
                  pred_word.b_o_val = pred_word.b_o_val.replace(item.namespace, item.prefix+':');      
                  pred_word.b_s_val = pred_word.b_s_val.replace(item.namespace, item.prefix+':');      
               })  
               this.tableData.predicate.push(pred_word);   
               this.filters['b_s_val'] = { value: null, matchMode: FilterMatchMode.CONTAINS }; 
               this.filters['b_o_val'] = { value: null, matchMode: FilterMatchMode.CONTAINS };   
            }

            // store data for third tab panel (subject, predicate)
            if(element.c_s && element.c_p){
               let obj_word = {
                  'c_s_val': element.c_s.value,
                  'c_s_tol': element.c_s.value,
                  'c_s_type': element.c_s.type,
                  'c_p_val': element.c_p.value,
                  'c_p_tol': element.c_p.value,
                  'c_p_type': element.c_p.type
               }            
            
               this.prefixes.forEach((item) => {
                  obj_word.c_p_val = obj_word.c_p_val.replace(item.namespace, item.prefix+':');      
                  obj_word.c_s_val = obj_word.c_s_val.replace(item.namespace, item.prefix+':');      
               })  
               this.tableData.object.push(obj_word);   
               this.filters['c_s_val'] = { value: null, matchMode: FilterMatchMode.CONTAINS }; 
               this.filters['c_p_val'] = { value: null, matchMode: FilterMatchMode.CONTAINS }; 
            }

         })

         // Set active table panel
         if(this.tableData.subject.length > 0) {
            this.activePanel = 0;
         } else if(this.tableData.predicate.length > 0){
            this.activePanel = 1;
         } else if(this.tableData.object.length > 0){
            this.activePanel = 2;
         }
      }
   }

}
</script>

<style>
.l_color{
   color: black !important;
}
</style>