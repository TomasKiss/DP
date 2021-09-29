<template>
  <Toast />
  <table class="error_td" style="width:100%;border: 2px solid black;">
    <tr>
      <td style="width:95%;">
        <prism-editor class="my-editor" v-model="code" :highlight="highlighter" line-numbers :key="render"></prism-editor>
      </td>
      <td>
          <tr v-for="i in newRowsCount" :key="i" :id="i-oldRowsCount+1" style="visibility: hidden">
            <td v-tooltip.right="errorText" class="error_td_size">
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

  // Theme for the editor
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
      code2: "PREFIX : <http://stardog.com/tutorial/> \n PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n SELECT ?album \n WHERE { ?album rdf:type :Album .}",
      // query entered by user
      code: "",//\n\n\n\n\n\n
      // if the sytax is valid
      valide: false,
      // array containing all prefix and namespace tupples
      prefixNsTuples: [],
      // number of rows in the query
      newRowsCount: 0,
      // number of rows in query before its change
      oldRowsCount: 1,
      // text of the error found during sytnach check
      errorText: ' ',
      // parser used for query validation
      parser: new Sparqljs.Parser(),
      // already added prefixes TODO: find better word
      alreadyAddedPrefs:[],
      render:0
    }),
    mounted() {
      this.queryAllNamespaces();
    },
    methods: {
      // creating syntax highlighted version of the query
      highlighter(code) {
        if(this.newRowsCount != 0) {
          this.deleteDivs();
          this.oldRowsCount = this.newRowsCount+1; // old 6 new 5
        } 

        let codeN = this.searchPrefixesToComplete(code)
        codeN.split("\n").forEach(element => {
          this.newRowsCount++
        })

        let highlightedCode = highlight(codeN, languages.sparql); // languages.<insert language> to return html with markup 
        console.log("high",highlightedCode)

        return highlightedCode
      },
      // fetching all namespaces present in the repository
      async queryAllNamespaces(){
        const data = await fetch('http://127.0.0.1:8080/rdf4j-server/repositories/1/namespaces', {
            method: 'GET',
            headers: {
              'Accept':'application/json',
            },
          })
          .then(res =>  {
            if(!res.ok){
              this.$toast.add({severity:'error', summary: 'Error', detail:"Error happened during fetch of all namespaces!"});
            } else { return res.json() }
          })
          .catch((error) => console.log(error))

        // storing namespaces with corresponding prefixes as tupples
        for (let index = 0; index < data.results.bindings.length; index++) {
          this.prefixNsTuples.push({
            'prefix': data.results.bindings[index].prefix.value,
            'namespace': data.results.bindings[index].namespace.value
          })
        }
        // console.log(this.prefixNsTuples)
      },
      // executing user given query
      async queryData(){
        // syntach validation
        this.validateQuery(this.code, this.parser);

        let answerToQuery;
        let err;
        if(this.valide){
          // CORS headers (filter) have to set in tomcat 9 web.xml file 
          answerToQuery = await fetch('http://127.0.0.1:8080/rdf4j-server/repositories/1?query='+encodeURIComponent(this.code), {
            method: 'GET',
            headers: {
              'Accept':'application/json',
            },
          })
          .then(res =>
              this.errorHandler(res)
          )
          .catch(error => 
            this.$toast.add({severity:'error', summary: 'Error', detail:error, life: 3000}),
          )
          console.log(answerToQuery)
          this.valide = !this.valide
        }

      },
      // validation of the query typed in by the user 
      validateQuery(code,parser){
        // let p = new Sparqljs.Parser()
        try {
          // syntax validation by parser
          let parsed = parser.parse(code)
          this.valide = true
          this.errorText = ' '
        } catch (error) {
          // parsing the number of the line on which the error is
          // from the error.message 
          this.errorText = error.message  
          const nthIndxOfSpace = this.nthIndex(this.errorText,' ',4) + 1
          const indxOfColon = this.errorText.indexOf(':')
          const rowNumWithError = this.errorText.substring(nthIndxOfSpace,indxOfColon) 

          console.log(rowNumWithError)
          console.log(error.message)

          // handling if in the error.message the line number is not specified
          if(!isNaN(rowNumWithError)){
            // line number is present
            document.getElementById(rowNumWithError).style.visibility = "visible"
            this.$toast.add({severity:'error', summary: 'Error Message', detail:'Query contains error!', life: 3000});
          } else {
            this.$toast.add({severity:'error', summary: 'Error Message', detail:'Query contains error: '+this.errorText});
          }
        }
      },
      // function to remove error icon placeholder divs from document 
      deleteDivs(){
        // console.log('oldC', this.oldRowsCount);
        // console.log('newC', this.newRowsCount);
        // console.log('deleteDiv', this.newRowsCount-this.oldRowsCount+1);
        for (let index = 1; index <= this.newRowsCount-this.oldRowsCount+1; index++) {
          // console.log('index',index)
          document.getElementById(index).remove()  
        }
      },
      // searching for the nth occurence of pattern in string
      // returns index of the occurence
      nthIndex(str, pat, n){
          var L= str.length, i= -1;
          while(n-- && i++<L){
              i= str.indexOf(pat, i);
              if (i < 0) break;
          }
          return i;
      },
      // controling if server response conatinas error
      async errorHandler(res){
        if(!res.ok){
          // something went wrong on server (status like: 4xx or 5xx, ...)
          this.$toast.add({severity:'error', summary: 'Error', detail:"Error happened during execution!", life: 3000});
        } else {
          this.$toast.add({severity:'success', summary: 'Success Message', detail:'Query was successfully executed!', life: 3000});
          return await res.json()
        }
      },
      // automatic completion of prefixes
      searchPrefixesToComplete(code){
        
        if(code.length > 0 && code.match(/([a-z][A-Z][0-9])*\w+/g)){
          const matched = code.match(/([a-z][A-Z])*\w*:([a-z][A-Z][0-9])*\w+/g); 
          // console.log(matched);
          if(matched){
            matched.forEach(element => {
              const prefix = element.substring(0,element.indexOf(":"));
              // console.log('prefix',prefix);
              // console.log("include",this.alreadyAddedPrefs.includes(prefix))
              if(!this.alreadyAddedPrefs.includes(prefix)){
                const ns = this.prefixNsTuples.filter(i => i.prefix == prefix)[0].namespace;
                // console.log('ns',ns);
                this.alreadyAddedPrefs.push(prefix);
                code = "PREFIX " + prefix +": <" +ns+ ">\r\n"+code; 
                document.getElementsByClassName('prism-editor__textarea')[0].value = code; 
                console.log("a",document.getElementsByClassName('prism-editor__textarea')[0].value);  
              }
            })
          }
        } else {
          this.alreadyAddedPrefs = [];
        }
        return code;
      }
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
    /* padding-top:35px; */
    min-height:20vh;
  }

  .error_td{
    background: #f5f2f0;
  }
  
  .error_td_size{
    font-size: 14px;
    line-height: 1.5;
  }

  /* optional class for removing the outline */
  .prism-editor__textarea:focus {
    outline: none;
  }
</style>
