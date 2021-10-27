<template>
  <Toast />
  <!-- TODO: height setting -->
  <div class="p-col text_left">
    <h1>Editor</h1>
  </div>
  <table class="common_bgc" style="width:100%; border: 2px solid black; min-height:20vh;">
    <tr>
      <th class="text_left padding_set" v-if="htmlCode.length">
        Namespaces:
      </th>
    </tr>  
    <tr v-for="(n,j) in htmlCode" :key="j">
      <!-- tds representing namespaces with prefixes -->
      <td class="text_left width_95 padding_set font_style" :id="`td-${j}`"></td>
    </tr>

    <tr>
      <td class="width_95">
        <prism-editor class="my-editor" v-model="code" :highlight="highlighter" line-numbers></prism-editor>
      </td>
      <td>
        <tr v-for="i in newRowsCount" :key="i" :id="i-oldRowsCount+1" style="visibility: hidden">
          <td v-tooltip.right="errorText" class="">
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
  // !!!!!!!!!!!!!!!!!!!!! turtle was needed as dependency
  import 'prismjs/components/prism-turtle'; 
  import 'prismjs/components/prism-sparql'; 

  // Theme for the editor
  import 'prismjs/themes/prism.css'; // import syntax highlighting styles

  // PrimeVue components
  import Button from 'primevue/button';
  import Tooltip from 'primevue/tooltip';
  import Toast from 'primevue/toast';
  import Textarea from 'primevue/textarea';
  
  // Sparql parser to validate query
  import Sparqljs from 'sparqljs'

  import { config } from '../../config';
  
  export default {
    name:'App',
    components: {
      PrismEditor,
      Button,
      Toast,
      Textarea,
    },
    emits: ['resultReturn','loadingResult'],
    directives: {
      'tooltip': Tooltip
    },
    data: () => ({ 
      // syntax highlighted html code representing prefixes in editor 
      htmlCode:[],
      code1: "SELECT ?a \n WHERE { ?a rdf:type :Album .}",
      // query entered by user
      code: "",//\n\n\n\n\n\n
      // if the syntax is valid
      valid: false,
      // array containing all prefix and namespace tuples
      prefixNsTuples: [],
      // number of rows in the query
      newRowsCount: 0,
      // number of rows in query before its change
      oldRowsCount: 1,
      // text of the error found during syntax check
      errorText: ' ',
      // parser used for query validation
      parser: new Sparqljs.Parser(),
      // already added prefixes TODO: find better word
      alreadyAddedPrefs:[],
      // prefix declarations to prepend to the query
      prefixTextDecls: [],
    }),
    mounted() {
      // this.queryAllNamespaces();
    },
    methods: {
      // creating syntax highlighted version of the query
      highlighter(code) {
        if(this.newRowsCount != 0) {
          this.deleteDivs();
          this.oldRowsCount = this.newRowsCount+1; // old 6 new 5
        } 

        this.searchPrefixesToComplete(code)
        this.setTdInnerHtml()
        

        code.split("\n").forEach(_ => {
          this.newRowsCount++
        })

        let highlightedCode = highlight(code, languages.sparql); // languages.<insert language> to return html with markup 

        return highlightedCode
      },
      // fetching all namespaces present in the repository
      async queryAllNamespaces(){
        const data = await fetch(config.server_url+'rdf4j-server/repositories/'+this.$route.params.repo+'/namespaces', {
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

        // storing namespaces with corresponding prefixes as tuples
        for (let index = 0; index < data.results.bindings.length; index++) {
          this.prefixNsTuples.push({
            'prefix': data.results.bindings[index].prefix.value,
            'namespace': data.results.bindings[index].namespace.value
          })
        }
      },
      // executing user given query
      async queryData(){

        // connect prefixes with query body
        let queryText = this.code;
        this.prefixTextDecls.forEach(element => {
          queryText = element.code + queryText;
        });
  
        // syntax validation
        this.validateQuery(queryText, this.parser);

        let answerToQuery;
        if(this.valid){
          // emit that the fetching of data started, so show spinner
          this.$emit('loadingResult', true);
          // CORS headers (filter) have to set in tomcat 9 web.xml file 
          // answerToQuery = await fetch(config.server_url
          //     +'rdf4j-server/repositories/'+this.$route.params.repo+'?query='+encodeURIComponent(queryText), {
          //   method: 'GET',
          //   headers: {
          //     'Accept':'application/json',
          //   },
          console.log(queryText);
          answerToQuery = await fetch(config.fitlayout_server_url
              +'api/r/'+this.$route.params.repo+'/repository/query', {
            method: 'POST',
            headers: {
              'Accept':'application/json',
              'Content-Type':'application/sparql-query'
            },
            body: queryText,


          })
          .then(res =>
              this.errorHandler(res)
          )
          .catch(error => 
            this.$toast.add({severity:'error', summary: 'Error', detail:error, life: 3000}),
          )
          this.valid = !this.valid
          console.log(answerToQuery);
          // console.log("answer test ",answerToQuery.results.bindings[0].a);
          // emit that the fetching of data ended, so hide spinner
          this.$emit('loadingResult', false);
          // emit answer if everything was OK and data was found
          if(answerToQuery.result.results.bindings.length > 0) {
            let data = [answerToQuery, this.prefixNsTuples];
            this.$emit('resultReturn', {data});
          } else {
            // no data found for the query
            this.$toast.add({severity:'warn', summary: 'Warn Message', detail:'Query was successful but no data found!', life: 5000});
          }
        }

      },
      // validation of the query typed in by the user 
      validateQuery(code,parser){
        // let p = new Sparqljs.Parser()
        try {
          // syntax validation by parser
          let parsed = parser.parse(code)
          this.valid = true
          this.errorText = ' '
        } catch (error) {
          // parsing the number of the line on which the error is
          // from the error.message 
          this.errorText = error.message  
          const nthIndxOfSpace = this.nthIndex(this.errorText,' ',4) + 1
          const indxOfColon = this.errorText.indexOf(':')
          const rowNumWithError = this.errorText.substring(nthIndxOfSpace,indxOfColon) 

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
        for (let index = 1; index <= this.newRowsCount-this.oldRowsCount+1; index++) {
          document.getElementById(index).remove()  
        }
      },
      // searching for the nth occurrence of pattern in string
      // returns index of the occurrence
      nthIndex(str, pat, n){
          var L= str.length, i= -1;
          while(n-- && i++<L){
              i= str.indexOf(pat, i);
              if (i < 0) break;
          }
          return i;
      },
      // controlling if server response contains error
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
        let newlyFoundPrefs = [];
        if(code.length > 0 && code.match(/([a-z][A-Z][0-9])*\w+/g)){
          // search for possible prefixes in the user given query
          const matched = code.match(/([a-z][A-Z])*\w*:([a-z][A-Z][0-9])*\w+/g); 
          if(matched){
            // control if the matched words are correct prefixes
            matched.forEach(element => {
              const prefix = element.substring(0,element.indexOf(":"));
              const ns = this.prefixNsTuples.filter(i => i.prefix == prefix)[0];

              // prepare proper html code to visualize prefix in the editor for the user
              if(ns && !newlyFoundPrefs.includes(prefix)){
                // this.alreadyAddedPrefs.push(prefix);
                newlyFoundPrefs.push(prefix);
                if(!this.alreadyAddedPrefs.includes(prefix)){
                  // store text representation of prefix
                  this.prefixTextDecls.push({
                    "prefix":prefix,
                    "code":"PREFIX " + prefix +": <" +ns.namespace+ ">"
                  })
                  // highlight the html code
                  let highlightedCode = highlight("PREFIX " + prefix +": <" +ns.namespace+ ">", languages.sparql);
                  this.htmlCode.push({
                    "prefix":prefix,
                    "code":highlightedCode});
                  }
              }

            })

            // control which previous prefixes are not present in the query
            this.alreadyAddedPrefs.forEach(e => {
              if(!newlyFoundPrefs.includes(e)) {
                this.htmlCode = this.htmlCode.filter(i => i.prefix !== e);
                this.prefixTextDecls = this.prefixTextDecls.filter(i => i.prefix !== e);              
              } 
            });

            // save all present prefixes
            this.alreadyAddedPrefs = newlyFoundPrefs;
          } else { 
            // clear html code after user deleting all prefixes from editor
            this.htmlCode = [];
          }
        } else {
          // no prefix found in the query
          this.alreadyAddedPrefs = [];
          this.htmlCode = [];
          this.prefixTextDecls = []; 
        }
      },

      setTdInnerHtml(){
        // wait until DOM is re-rendered
        this.$nextTick(()=>{
         
          if(this.htmlCode.length>0){
            // set the inner HTML of the td = show the namespace with prefix to the user
            this.htmlCode.forEach((e,i) => {
              document.getElementById('td-'+(i)).innerHTML = e.code;
            });
          }
        }
      )
      }
    },
  };
</script>

<style>
  /* required class */
  .my-editor {
    /* we don't use `language-` classes anymore so thats why we need to add background and text color manually */
    background: #f5f2f0;
    /* color: #5faac9; */

    /* you must provide font-family font-size line-height. Example: */
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
    position: absolute;
    left: 0;
    top: 0;
    /* padding-top:35px; */
    /* min-height:20vh; */
  }

  .common_bgc{
    background: #f5f2f0;
  }
  
  .error_td_size{
    font-size: 14px;
    padding: 5px;
    line-height: 1.5;
    height: 100%;
  }

  /* optional class for removing the outline */
  .prism-editor__textarea:focus {
    outline: none;
  }

  .text_left{
    text-align: left;
  }

  .width_95{
    width: 95%;
    position: relative;
  }

  .padding_set{
    padding: 0 25px;
    padding-top: 5px;
  }

  .font_style{
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
  }
</style>
