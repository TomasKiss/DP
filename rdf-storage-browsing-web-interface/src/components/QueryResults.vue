<template>
<div v-if="showUserQueryRes">
  <ResourceExplorer :resource="resource" :prefixes="result.data[1]" ></ResourceExplorer>
</div>
<div v-else class="p-datatable p-component p-datatable-responsive-scroll" data-scrollselectors=".p-datatable-wrapper" pv_id_5="">

    <div class="p-datatable-wrapper">
        <table role="table" class="p-datatable-table">
            <thead class="p-datatable-thead" role="rowgroup">
                <tr role="row">
                    <th v-for="c in columns" :key="c.field" class="" role="cell">
                        <!---->
                        <div class="p-column-header-content">
                        <!---->
                            <span class="p-column-title">{{c.field}}</span>
                            <!----><!----><!----><!---->
                        </div>
                    </th>
                </tr>
                <!---->
            </thead>
            <!---->
            <tbody class="p-datatable-tbody" role="rowgroup">
                    <!---->
                <tr v-for="col in computedResult" :key="col" class="" role="row" draggable="false">
                    <td v-for="c in col" :key="c.val" class="" role="cell">
                      <Button @click="exploreResource(c.tol)" v-tooltip.bottom="c.tol" :label="c.val" class="p-button-link" />
                    </td>
                </tr>
            </tbody>
                <!---->
        </table>
    </div>
        <!----><!---->
    <div class="p-column-resizer-helper" style="display: none;"></div>
<!----><!---->
</div>

</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import ResourceExplorer from './ResourceExplorer.vue'

export default {
    name: 'QueryResults',
    props: ['result'],
    components:{
      DataTable,
      Column,
      Button,
      ResourceExplorer
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
        }
    },
    mounted() {
        if(this.result) {
          // hide table 
          this.showUserQueryRes = false;
          // store column headers 
          this.result.data[0].head.vars.forEach((item) => {
            this.columns.push({
              'field': item,
            });  
          })

          // loop processing response and transforming it to row data  
          this.result.data[0].results.bindings.forEach((element) => {
            let answers = [];
            // process one rowe data
            this.columns.forEach((item) => {
              if(element[item.field]){
                // for column data store : value(with prefix), tooltip(with full URI), type(literal/uri/...)
                let word = {'val': element[item.field].value, 'tol': element[item.field].value, 'type': element[item.field].type};

                // replace namespace with prefix if present
                this.result.data[1].forEach((item) => {
                  word.val = word.val.replace(item.namespace, item.prefix+':');      
                })
                
                // transform value if literal is the actual item, add datatype to value
                if(element[item.field].type !== 'uri' && element[item.field].datatype){
                  
                  word.tol = '"' +word.val+'"^^xsd:'+element[item.field].datatype.substring(element[item.field].datatype.indexOf("#")+1);;
                }
                
                // store column data
                answers.push(word);  
              }
            })
            // store row data
            this.computedResult.push(answers);
          })
        }  
    },
    methods: {
      // function activating resource exploration component
      exploreResource(resource){
        this.resource = resource;
        console.log(this.resource, resource);
        if(this.resource !== '')
          this.showUserQueryRes = true;
      }
    }
}
</script>

<style>
.p-button{
  text-align: left !important;
}
</style>