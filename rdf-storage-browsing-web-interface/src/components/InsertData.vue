<template>
    <Toast />
    <div class="main">
        <div class="p-grid p-flex-column">
            <div class="p-col-12">
                <h1>Insert new data to repository</h1>
            </div>
            <div class="p-col-12 leftText">
                <h5 class="leftText">Upload data format</h5>
                <Dropdown v-model="selectedFormat" :options="formats" optionLabel="name" optionValue="code" placeholder="Select a Format"/>
            </div>
            <div class="p-col-12">
            <h3 class="leftText">Upload from URL</h3>
                <span class="leftText" >
                    <InputText id="url" type="text" v-model="url" class="p-inputtext p-component" placeholder="URL"/>
                    <!-- <label for="url" class="">URL</label> -->
                </span>
            </div>
            <div class="p-col-12">
            <h3 class="leftText">Upload from File</h3>     
                <FileUpload 
                    name="demo[]"
                    v-model="file" 
                    url="" 
                    @select="onSelect"
                    @clear="onCancel" 
                    :multiple="false" accept="" :showUploadButton="false"
                    :auto="false"
                    :customUpload="true"
                    :fileLimit="1"
                >
                    <template #empty>
                        <p>Drag and drop files to here to upload.</p>
                    </template>
                </FileUpload>
            </div>
            <div class="p-col-12">
                <h3 class="leftText">Upload data as text</h3>

                <Textarea v-model="textData" :autoResize="true" rows="5" cols="80" placeholder="Data in text format"/>
            </div>    
            <div class="p-col-12 uploadData">
                <Button @click="uploadData" icon="pi pi-upload" iconPos="left" label="Upload" class="p-button-sm"/>
            </div>
        </div>
    </div>
</template>

<script>
import Toast from 'primevue/toast';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';

let config = require('../config.js');

export default {
    name: 'InsertData',
    components: {
        Toast,
        FileUpload,
        InputText,
        Button,
        Dropdown,
        Textarea,
    },
    data() {
        return {
            url:"",
            file: "",
            selectedFormat: "",
            formats: [
                {name: 'JSON LD', code: 'application/ld+json'},
                {name: 'Turtle', code: 'text/turtle'},
                {name: 'RDF/XML', code: 'application/rdf+xml'},
                {name: 'N-Triples', code: 'application/n-triples'},
                {name: 'N-Quads', code: 'application/n-quads'},
            ],
            textData: "",
            destUrl: config.server_url+'api/r/'+this.$route.params.repo+'/repository/statements'
        }
    },
    methods: {
        // If file upload is selected by user
        onSelect(event) {
            this.file = event.files;
        },

        // If file upload is canceled by user
        onCancel() {
            this.file = "";
        },
        
        // Control if the all needed information is given by user and perform the upload
        async uploadData() {
            if(this.selectedFormat == ""){
                // Error no format selected
                this.$toast.add({severity: 'error', summary: 'Error', detail: 'No data format chosen!', life: 3000});
            } else if(this.url == "" && this.file == "" && this.textData == ""){
                // Error no source selected
                this.$toast.add({severity: 'error', summary: 'Error', detail: 'No data source chosen!', life: 3000});
            } else if (this.url != "" && this.file == "" && this.textData == ""){
                // Data upload from URL source
                let data = await this.$root.apiClient.fetchDataFromUrl(this.url, this);
                if(data.ok){
                    data = await data.text();
                    let res = await this.$root.apiClient.uploadDataToServer(this.destUrl, data, this.selectedFormat);
                    this.controlUploadResponse(res, "URL");

                } else {
                    this.$toast.add({severity: "error", summary: "Error", detail: error, life: 3000});
                }

                
            } else if (this.url == "" && this.file != "" && this.textData == ""){
                // Data upload from File
                let res = await this.$root.apiClient.uploadDataToServer(this.destUrl, this.file[0], this.selectedFormat);
                this.controlUploadResponse(res, "File");
            } else if (this.url == "" && this.file == "" && this.textData != ""){
                // Data upload from Textarea
                let res = await this.$root.apiClient.uploadDataToServer(this.destUrl, this.textData, this.selectedFormat);
                this.controlUploadResponse(res, "TextArea");
            } else {
                // Error more source selected
                this.$toast.add({severity: 'error', summary: 'Error', detail: 'Please select just one data source!', life: 3000});
            }
        },

          async controlUploadResponse(res, source) {
            // Control the response status
            if (res.ok) {
            this.$toast.add({
                severity: "info",
                summary: "Success",
                detail: "Data Uploaded form " + source,
                life: 3000,
            });
            } else {
            this.$toast.add({
                severity: "error",
                summary: "Error",
                detail: error,
                life: 3000,
            });
            }
        }
    }
}
</script>
<style>
.leftText {
    text-align: left;
}

.uploadData {
    text-align:center;
    margin-top:10px;
}

/* classes from PrimeVue */
.p-float-label>input:focus~label, .p-float-label>input.p-state-filled~label, 
.p-float-label>.p-inputwrapper-focus~label, .p-float-label>.p-inputwrapper-filled~label 
{ top: -.75em; font-size: 12px; }

.p-float-label>textarea:focus~label, .p-float-label>textarea.p-state-filled~label, 
.p-float-label>.p-textareawrapper-focus~label, .p-float-label>.p-textareawrapper-filled~label 
{ top: -.75em; font-size: 12px; }

.p-fileupload-buttonbar{
    background-color: rgb(216, 216, 216) !important;
}

</style>