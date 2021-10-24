<template>
<div>
   <h3>Resource: {{res}}</h3>
</div>
<TabView :activeIndex="activePanel">
	<TabPanel header="Subject" :disabled="!tableData.subject.length">
      <DataTable  :value="tableData.subject" responsiveLayout="scroll"
      :paginator="true" :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10,20,50]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
         <Column  header="Predicate"> 
            <template #body="slotProps">
                  <Button @click="fetchResData(slotProps.data.a_p_tol)" 
                     v-tooltip.bottom="slotProps.data.a_p_tol" :label="slotProps.data.a_p_val" class="p-button-link" />
            </template>
         </Column>
         <Column  header="Object"> 
            <template #body="slotProps">
                  <Button @click="fetchResData(slotProps.data.a_o_tol)"
                     v-tooltip.bottom="slotProps.data.a_o_tol" :label="slotProps.data.a_o_val" class="p-button-link" />
            </template>
         </Column>
      </DataTable>
	</TabPanel>
	<TabPanel header="Predicate" :disabled="!tableData.predicate.length">
      <DataTable  :value="tableData.predicate" responsiveLayout="scroll"
      :paginator="true" :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10,20,50]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
         <Column  header="Subject"> 
            <template #body="slotProps">
                  <Button @click="fetchResData(slotProps.data.b_s_tol)" 
                     v-tooltip.bottom="slotProps.data.b_s_tol" :label="slotProps.data.b_s_val" class="p-button-link" />
            </template>
         </Column>
         <Column  header="Object"> 
            <template #body="slotProps">
                  <Button @click="fetchResData(slotProps.data.b_o_tol)"
                     v-tooltip.bottom="slotProps.data.b_o_tol" :label="slotProps.data.b_o_val" class="p-button-link" />
            </template>
         </Column>
      </DataTable>
   </TabPanel>
	<TabPanel header="Object" :disabled="!tableData.object.length">
      <DataTable  :value="tableData.object" responsiveLayout="scroll"
      :paginator="true" :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10,20,50]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
         <Column  header="Subject"> 
            <template #body="slotProps">
                  <Button @click="fetchResData(slotProps.data.c_s_tol)" 
                     v-tooltip.bottom="slotProps.data.c_s_tol" :label="slotProps.data.c_s_val" class="p-button-link" />
            </template>
         </Column>
         <Column  header="Predicate"> 
            <template #body="slotProps">
                  <Button @click="fetchResData(slotProps.data.c_p_tol)"
                     v-tooltip.bottom="slotProps.data.c_p_tol" :label="slotProps.data.c_p_val" class="p-button-link" />
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
import { config } from '../../config';

export default {
   name : 'ResourceExplorer',
   props : ['resource','prefixes'],
   components: {
      TabView,
      TabPanel,
      DataTable,
      Column,
      Button,
   },
   data() {
      return {
         qStart : 'SELECT * {',
         // container for data presented in table    
         tableData : {
            'subject':[],
            'predicate':[],
            'object':[]
         },
         //  tab panel headers 
         headers : ["Subject", "Predicate", "Object"],
         // resource which is currently examined   
         res : '',
         // id of active tab panel
         activePanel : 0
      }
   },
   async mounted() {
      console.log(this.resource);
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
         // initialize needed variables
         this.tableData.subject = [];
         this.tableData.predicate = [];
         this.tableData.object = [];
         this.res = resource;
         this.activePanel = 0;

         console.log(this.resource, queryText);
         let data = await fetch(config.server_url+'rdf4j-server/repositories/'+this.$route.params.repo+'?query='+encodeURIComponent(queryText), {
            method: 'GET',
            headers: {
              'Accept':'application/json',
            },
         })
         .then(res =>  {
            return res.json() 
         })
         .catch((error) => console.log(error))

         console.log(data);
         // convert response to easier accessible data
         this.dataProcessing(data);
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