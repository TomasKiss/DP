<template>
  <Toast />
  <table class="error_td" style="width:100%;border: 2px solid black;">
    <tr>
      <td style="width:95%;">
        <prism-editor class="my-editor" v-model="code" :highlight="highlighter" line-numbers></prism-editor>
      </td>
      <td>
          <tr v-for="i in newRowsCount" :key="i" :id="i-oldRowsCount+1" style="visibility: hidden">
            <td v-tooltip.right="errorText">
              <i style="color:red" class="pi pi-times-circle"></i>
            </td>
          </tr>
      </td>
    </tr>
  </table>
  <div style="text-align:center;margin-top:10px;">
    <Button @click="queryData" label="Execute" class="p-button-sm" />
  </div>
</template>

<script>
  // import Prism Editor
  import { PrismEditor } from 'vue-prism-editor';
  import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere
  
  // import highlighting library (you can use any library you want just return html string)
  import { highlight, languages } from 'prismjs/components/prism-core';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-javascript';
  // !!!!!!!!!!!!!!!!!!!!! turtle was needed as dependenci
  import 'prismjs/components/prism-turtle'; 
  import 'prismjs/components/prism-sparql'; 
  // Theme
  import 'prismjs/themes/prism.css'; // import syntax highlighting styles

  // PrimeVue components
  import Button from 'primevue/button';
  import Tooltip from 'primevue/tooltip';
  import Toast from 'primevue/toast';

  // Sparql parser to validate query
  import Sparqljs from 'sparqljs'


  export default {
    name:'App',
    components: {
      PrismEditor,
      Button,
      Toast,
    },
    directives: {
      'tooltip': Tooltip
    },
    data: () => ({ 
      code: "PREFIX : <http://stardog.com/tutorial/> \n PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n SELECT ?album \n WHERE { ?album rdf:type :Album .}",
      valide: false,
      items: [],
      newRowsCount: 0,
      oldRowsCount: 1,
      errorText: ' ',
      parser: new Sparqljs.Parser()
    }),
    methods: {
      highlighter(code) {
        
        if(this.newRowsCount != 0) {
          this.deleteDivs()
          this.oldRowsCount = this.newRowsCount+1
        } 

        code.split("\n").forEach(element => {
          this.newRowsCount++
        })

        let highlightedCode = highlight(code, languages.sparql); // languages.<insert language> to return html with markup 
        return highlightedCode
      },
      async queryRepositories() {
        // CORS headers (filter) have to set in tomcat 9 web.xml file 
        let answerToQuery = await fetch('http://127.0.0.1:8080/rdf4j-server/repositories', {
          method: 'GET',
          headers: {
            // 'content-type': 'application/sparql-query',
            'Accept':'application/json',
            // 'Sec-Fetch-Dest': 'font'
          },
        })
        .then(res => {
         return res.text()})
        .catch((error) => console.log(error))
      },
      async queryData(){
        this.validateQuery(this.code, this.parser);

        let answerToQuery;
        if(this.valide){
        // CORS headers (filter) have to set in tomcat 9 web.xml file 
        answerToQuery = await fetch('http://127.0.0.1:8080/rdf4j-server/repositories/1/namespaces', {
          method: 'GET',
          headers: {
            'Accept':'application/json',
          },
        })
        .then(res => {
          return res.json()})
        .catch((error) => console.log(error))
        console.log(answerToQuery)
        this.$toast.add({severity:'success', summary: 'Success Message', detail:'Query was successfully executed!', life: 3000});
        this.valide = !this.valide
        }

      },
      validateQuery(code,parser){
        // let p = new Sparqljs.Parser()
        try {
          let parsed = parser.parse(code)
          this.valide = true
          this.errorText = ' '
        } catch (error) {
          this.errorText = error.message  
          const nthIndxOfSpace = this.nthIndex(this.errorText,' ',4) + 1
          const indxOfColon = this.errorText.indexOf(':')
          const rowNumWithError = this.errorText.substring(nthIndxOfSpace,indxOfColon) 

          console.log(rowNumWithError)
          console.log(error.message)
          document.getElementById(rowNumWithError).style.visibility = "visible"
          this.$toast.add({severity:'error', summary: 'Error Message', detail:'Query contains error!', life: 3000});
        }
      },
      deleteDivs(){
        for (let index = 1; index <= this.newRowsCount-this.oldRowsCount+1; index++) {
          document.getElementById(index).remove()
          
        }
      },
      nthIndex(str, pat, n){
          var L= str.length, i= -1;
          while(n-- && i++<L){
              i= str.indexOf(pat, i);
              if (i < 0) break;
          }
          return i;
      },


    },
  };
</script>

<style>
  /* required class */
  .my-editor {
    /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
    background: #f5f2f0;
    /* color: #5faac9; */

    /* you must provide font-family font-size line-height. Example: */
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
    min-height:20vh;
  }

  .error_td{
    background: #f5f2f0;
  }

  /* optional class for removing the outline */
  .prism-editor__textarea:focus {
    outline: none;
  }
</style>
