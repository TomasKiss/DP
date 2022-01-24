<template>
<Toast/>

<DataTable :value="allQueriesName.data" responsiveLayout="scroll" 
    :paginator="true" :rows="10"
    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    :rowsPerPageOptions="[10,20,50]"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
    headerStyle="text-align: center"
    >

    <template #empty>
        No data found.
    </template>

    <template #loading>
        Loading data. Please wait.
    </template>
    <Column header="Saved query" bodyStyle="text-align: center">
        <template #body="slotProps">
            {{slotProps.data.name}}
        </template>
    </Column>

    <Column  header="Options" bodyStyle="text-align: center">
        <template #body="slotProps">
            <!-- <Button @click="showQuery(slotProps.data.name)" class="p-button-sm margin-right"
            v-tooltip.bottom="'Show query'">Show</Button> -->

            <Button @click="editQuery(slotProps.data.name)" class="p-button-sm margin-right p-button-warning" v-tooltip.bottom="'Edit query'">
                <i class="pi pi-pencil"></i>
            </Button>

            <Button @click="confirmRemove(slotProps.data.name)" class="p-button-sm p-button-danger" v-tooltip.bottom="'Remove query'">
                <i class="pi pi-trash"></i>
            </Button>

        </template>
    </Column>
</DataTable>  
<Toast position="bottom-center" group="bc">
    <template #message="slotProps">
        <div class="p-d-flex p-flex-column">
            <div class="p-text-center">
                <i class="pi pi-exclamation-triangle" style="font-size: 3rem"></i>
                <h4>Are you sure you want to remove this saved query?</h4>
                <p></p>
            </div>
            <div class="p-grid p-fluid">
                <div class="p-col-6">
                    <Button class="p-button-success" label="Yes" @click="onConfirmRemove(slotProps.message.name)" />
                </div>
                <div class="p-col-6">
                    <Button class="p-button-secondary" label="No" @click="onRejectRemove" />
                </div>
            </div>
        </div>
    </template>
</Toast>


</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

export default {
    name: 'SavedQueries',
    components: {
      DataTable,
      Column,
      Button,
      Toast,
    },
    data() {
        return {
            allQueriesName:  {"data":[]},
            storedQueries: [],
        }
    },
    mounted() {
        this.getAllQueriesName();
    },
    methods: {
        // Get all queries saved in the local storage
        getAllQueriesName() {
            if(localStorage.getItem('storedQueries')){
                this.storedQueries = JSON.parse(localStorage.getItem('storedQueries'));

                this.storedQueries.forEach(item => {
                    this.allQueriesName.data.push({
                        'name': item.name
                    });
                
                });

            }
        },
        // Edit the chosen query
        editQuery(queryName){
            this.$router.push({ name: 'Home', params: { name: queryName, repo: this.$route.params.repo, 
                do: 'show'} 
            });

        },
        // open toast to confirm removal of namespace
        confirmRemove(queryName){
            this.$toast.add({severity: 'warn', name: queryName, group: 'bc'});
        },
        // removal of query was rejected, close toast
        onRejectRemove() {
            this.$toast.removeGroup('bc');
        },
        // removal of query after confirmation
        onConfirmRemove(queryName) {
            this.deleteQuery(queryName);
            this.$toast.removeGroup('bc');
        },
        // Delete the chosen query from local storage
        deleteQuery(queryName){
            this.storedQueries = this.storedQueries.filter(item => item.name != queryName);
            
            const parsed = JSON.stringify(this.storedQueries);
            localStorage.setItem('storedQueries', parsed);
            
            this.allQueriesName.data = [];
            this.getAllQueriesName();

        },
        // Show the chosen query in editor 
        showQuery(queryName) {
            this.$router.push({ name: 'Home', params: { name: queryName, repo: this.$route.params.repo, 
                do: 'show'} 
            });

        },
        // executeQuery(queryName) {
        //     // Execute the chosen query

        //     this.$router.push({ name: 'Home', params: { name: queryName, repo: this.$route.params.repo, 
        //         do: 'execute', query: this.$cookie.getCookie(queryName)} 
        //     });
        // },
        

    },    
}
</script>

<style>

</style>