// Import file containing server url
let config = require("../config.js");

// Class responsible for performing all HTTP requests
// which have to be sent to the server
export default class RdfApiClient {
  // Fetching all namespaces present in the repository
  // repo - identifier of the repository
  async queryAllNamespaces(repo) {
    const data = await fetch(
      config.server_url + "api/r/" + repo + "/repository/namespaces",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((res) => res)
      .catch((error) => console.log(error));

    return data;
  }

  // Sending SPARQL query to the specified server
  // repo - identifier of the repository
  // queryText - query created in editor by the user
  // queryType - type of the query (select, create, ...)
  async sendSparqlQuery(repo, queryText, queryType) {
    let sendQueryToUrl = config.server_url + "api/r/" + repo;
    // Change the URL end based on the type of query
    if (queryType == "update") {
      sendQueryToUrl = sendQueryToUrl + "/repository/updateQuery";
    } else {
      sendQueryToUrl = sendQueryToUrl + "/repository/query";
    }

    let data = await fetch(sendQueryToUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/sparql-query",
      },
      body: queryText,
    })
      .then((res) => res)
      .catch((error) => error);

    // Return the server response for further processing
    return data;
  }

  // Data upload to server, insert new data into repository
  // repo - identifier of the repository
  // data - RDF data to be inserted into the repository
  // selectedFormat - data serialization format (Turtle, N-Triples, ...)
  async uploadDataToServer(repo, data, selectedFormat) {
    let response = await fetch(
      config.server_url + "api/r/" + repo + "/repository/statements",
      {
        method: "POST",
        headers: {
          "Content-Type": selectedFormat,
        },
        body: data,
      }
    )
      .then((res) => res)
      .catch((error) => error);
    return response;
  }

  // Fetching RDF data from user specified URL
  // url - URL of the data
  async fetchDataFromUrl(url) {
    let data = await fetch(url, {
      method: "GET",
      headers: {},
    })
      .then((res) => res)
      .catch((error) => error);
    return data;
  }

  // Delete namespace represented with user specified
  // prefix from chosen repository
  // repo - identifier of the repository
  // prefixToRemove - prefix of namespace which has to be removed
  async removeNamespaceFromRepo(repo, prefixToRemove) {
    let response = await fetch(
      config.server_url +
        "api/r/" +
        repo +
        "/repository/namespaces/" +
        prefixToRemove,
      {
        method: "DELETE",
      }
    )
      .then((res) => res)
      .catch((error) => error);
    return response;
  }

  // Create new namespace with prefix in the chosen repository
  // repo - identifier of the repository
  // newNSprefix - prefix of the new namespace
  // newNSname - name of the new namespace
  async createNamespace(repo, newNSprefix, newNSname) {
    let response = await fetch(
      config.server_url +
        "api/r/" +
        repo +
        "/repository/namespaces/" +
        newNSprefix,
      {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
        },
        body: newNSname,
      }
    )
      .then((res) => res)
      .catch((error) => error);

    return response;
  }
}
