# rdf-storage-browsing-web-interface

The application is working with RDF data repositories. It provides a web interface that enables users to explore and manipulate with the content of these repositories. The users gain ability to create SPARQL queries in a simple editor with syntax highlighting and syntax analysis. Other options include: uploading new data to the repository, maintenance of prefixes and namespaces, and storage of frequently used queries. 

This project was created as a part of the masters thesis at the **Faculty of Information Technology, Brno University of Technology** in 2021/2022.

## Project setup

* Enter the directory containing the source files 
```
    cd 'program_directory'
```
* Install all needed dependencies
```
    npm install
```

* Run the app on localhost (ensures compile and hot-reloads for development)
```
    npm run serve
```

The app is available on URL *"http://localhost:8080/r/:repo/"*. The ":repo" part of the URL presents the repositories ID.

## Customize configuration
The URL of the server, to which all requests are sent and is responsible for the repositories maintenance, can be customized in the file **./src/config.js**. The base value of this variable is set to *"http://127.0.0.1:8400/"*.



## NPM package creation and usage

To enable for the users to reuse one or more components created int this project an NPM package was created. This package can be simply installed by following command:
```
npm install rdf-storage-browsing-web-interface
```
The packages NPM site can be found on following [link]().

### Local build and usage

The components and other necessary files from the project can be built in to a single library by running the following command:
```
npm run build
```

For local compression of the created library NPM provides following instruction which compresses all necessary files in to a new .tgz file:
```
npm pack
```

Then the created .tgz file can be installed in to other applications simply by using the following instruction:
```
npm i "path to created .tgz file"
```

### Components in the package

* *RdfEditor* - editor for query creation
* *QueryResults* - showing the results of queries
* *ResourceExplorer* - showing data about chosen resource 
* *SavedQueries* - storage and maintenance of user defined queries
* *InsertData* - form for uploading new data in to the RDF repository 
* *NamespacesMaintenance* - creation and maintenance of prefixes and namespaces
* *ApiClient* - class performing communication with the server

## Necessary steps for proper usage of components

For components to work as intended the following lines of codes have to be added to the projects *main.js* file:
```js
import ToastService from 'primevue/toastservice';
import "primevue/resources/themes/saga-blue/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css";

import 'vue-prism-editor/dist/prismeditor.min.css'; // import the editor base styles
import 'prismjs/themes/prism.css'; // import syntax highlighting styles

import 'rdf-storage-browsing-web-interface/dist/style.css'
import install from 'rdf-storage-browsing-web-interface'
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
.
.
.
const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);
app.use(ConfirmationService);
app.use(router);

app.use(install)
app.component("Toast", Toast);
app.component("Dialog", Dialog);

app.directive('tooltip', Tooltip);

```
Then when registering components locally the *'ConfirmingDialog'* and *'Toast'* components have to be imported too. For example when using the *'NamespacesMaintenance'* component the following lines of code have to be added in to the given file:
```js
<Toast/>
<ConfirmDialog/>

<NamespacesMaintenance />
.
.
.
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

```


## Built With

* [Vue.js](https://vuejs.org/) - JavaScript framework
* [PrimeVue](https://www.primefaces.org/primevue/#/) - UI component library
* [Vue Prism Editor](https://www.npmjs.com/package/vue-prism-editor) - Code editor with syntax highlighting
* [SPARQL.js](https://github.com/RubenVerborgh/SPARQL.js) - A SPARQL 1.1 parser for JavaScript 


## Authors

* **Tomáš Kiss** - *xkisst00* - e-mail: xkisst00@stud.fit.vutbr.cz 

## License

The project is released under the [MIT License](https://github.com/TomasKiss/DP/blob/main/LICENSE.md).