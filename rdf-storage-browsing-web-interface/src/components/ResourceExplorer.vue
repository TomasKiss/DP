<template>
<div>
   <h3>Resource: {{res}}</h3>
</div>
<TabView>
	<TabPanel header="Subject">
      <DataTable  :value="tableData.subject" responsiveLayout="scroll">
         <Column  header="Predicate"> 
            <template #body="slotProps">
                  <Button @click="fetchResData(slotProps.data.a_p_tol)" 
                     v-tooltip.bottom="slotProps.data.a_p_tol" :label="slotProps.data.a_p_val" class="p-button-link" />
                  <!-- <span class="p-button p-component p-button-link l_color" v-else v-tooltip.bottom="slotProps.data.a_p_tol">
                     {{slotProps.data.a_p_val}}
                  </span> -->
            </template>
         </Column>
         <Column  header="Object"> 
            <template #body="slotProps">
                  <Button @click="fetchResData(slotProps.data.a_o_tol)"
                     v-tooltip.bottom="slotProps.data.a_o_tol" :label="slotProps.data.a_o_val" class="p-button-link" />
                  <!-- <span class="p-button p-component p-button-link l_color" v-else v-tooltip.bottom="slotProps.data.a_o_tol">
                     {{slotProps.data.a_o_val}}
                  </span> -->
            </template>
         </Column>
      </DataTable>
	</TabPanel>
	<TabPanel header="Predicate">
      <DataTable  :value="tableData.predicate" responsiveLayout="scroll">
         <Column  header="Subject"> 
            <template #body="slotProps">
                  <Button @click="fetchResData(slotProps.data.b_s_tol)" 
                     v-tooltip.bottom="slotProps.data.b_s_tol" :label="slotProps.data.b_s_val" class="p-button-link" />
                  <!-- <span class="p-button p-component p-button-link l_color" v-else v-tooltip.bottom="slotProps.data.b_s_tol">
                     {{slotProps.data.b_s_val}}
                  </span> -->
            </template>
         </Column>
         <Column  header="Object"> 
            <template #body="slotProps">
                  <Button @click="fetchResData(slotProps.data.b_o_tol)"
                     v-tooltip.bottom="slotProps.data.b_o_tol" :label="slotProps.data.b_o_val" class="p-button-link" />
                  <!-- <span class="p-button p-component p-button-link l_color" v-else v-tooltip.bottom="slotProps.data.b_o_tol">
                     {{slotProps.data.b_o_val}}
                  </span> -->
            </template>
         </Column>
      </DataTable>
   </TabPanel>
	<TabPanel header="Object">
      <DataTable  :value="tableData.object" responsiveLayout="scroll">
         <Column  header="Subject"> 
            <template #body="slotProps">
                  <Button @click="fetchResData(slotProps.data.c_s_tol)" 
                     v-tooltip.bottom="slotProps.data.c_s_tol" :label="slotProps.data.c_s_val" class="p-button-link" />
                  <!-- <span class="p-button p-component p-button-link l_color" v-else v-tooltip.bottom="slotProps.data.c_s_tol">
                     {{slotProps.data.c_s_val}}
                  </span> -->
            </template>
         </Column>
         <Column  header="Predicate"> 
            <template #body="slotProps">
                  <Button @click="fetchResData(slotProps.data.c_p_tol)"
                     v-tooltip.bottom="slotProps.data.c_p_tol" :label="slotProps.data.c_p_val" class="p-button-link" />
                  <!-- <span class="p-button p-component p-button-link l_color" v-else v-tooltip.bottom="slotProps.data.c_p_tol">
                     {{slotProps.data.c_p_val}}
                  </span> -->
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
           tableData : {
              'subject':[],
              'predicate':[],
              'object':[]
           },
           headers : ["Subject", "Predicate", "Object"],
           res : '',
       }
   },
   async mounted() {
      console.log(this.resource);
      this.res = this.resource;
      await this.fetchResData(this.resource);
   },
   methods: {
      async fetchResData(resource) {
         let queryText = this.createQuery(resource);   

         this.tableData.subject = [];
         this.tableData.predicate = [];
         this.tableData.object = [];
         this.res = resource;

         console.log(this.resource, queryText);
         let data = await fetch(config.server_url+'rdf4j-server/repositories/1?query='+encodeURIComponent(queryText), {
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

         this.dataProcessing(data);
      },
      createQuery(resource){
         if(resource.includes("^^xsd:")){
            return this.qStart + '{' + resource + "?a_p?a_o.}UNION"
            // +"{?b_s" + resource + "?b_o.}UNION"
            +"{?c_s?c_p"+ resource +".}}";
         } else {
            return this.qStart + '{<' + resource + ">?a_p?a_o.}UNION"
            +"{?b_s<" + resource + ">?b_o.}UNION"
            +"{?c_s?c_p<"+ resource +">.}}";
         }
      },
      dataProcessing(data){
         data.results.bindings.forEach((element) => {   
            if(element.a_p && element.a_o){
               let sub_word = {
                  'a_o_val': element.a_o.value,
                  'a_o_tol': element.a_o.value,
                  'a_o_type': element.a_o.type,
                  'a_p_val': element.a_p.value,
                  'a_p_tol': element.a_p.value,
                  'a_p_type': element.a_p.type
               }            
            
               this.prefixes.forEach((item) => {
                  sub_word.a_o_val = sub_word.a_o_val.replace(item.namespace, item.prefix+':');      
                  sub_word.a_p_val = sub_word.a_p_val.replace(item.namespace, item.prefix+':');      
               })  
               this.tableData.subject.push(sub_word);   
               
            }

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

      }
   }

}
</script>

<style>
.l_color{
   color: black !important;
}
</style>