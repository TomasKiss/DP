// Import vue components
import * as components from "./components.js";

// install function executed by Vue.use()
const install = function installRdfStorageBrowsingWebInterface(app) {
  Object.entries(components).forEach(([componentName, component]) => {
    app.component(componentName, component);
  });
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from "./components.js";
