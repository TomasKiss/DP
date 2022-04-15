let config = require("../config.js");

export default class RdfApiClient {
  // Fetching all namespaces present in the repository
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
  async sendSparqlQuery(repo, queryText, queryType) {
    let sendQueryToUrl = config.server_url + "api/r/" + repo;
    // change the URL end based on the type of query
    if (this.queryType == "update") {
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

    return data;
  }

  // Data upload to server
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

  // Fetching RDF data from URL
  async fetchDataFromUrl(url) {
    let data = await fetch(url, {
      method: "GET",
      headers: {},
    })
      .then((res) => res)
      .catch((error) => error);
    return data;
  }

  async removeNamespaceFromRepo(repo, prefixToRemove) {
    let res = await fetch(
      config.server_url +
        "api/r/" +
        repo +
        "/repository/namespaces/" +
        prefixToRemove,
      {
        method: "DELETE",
      }
    )
      .then((response) => response)
      .catch((error) => error);
    return res;
  }

  async createNamespace(repo, newNSprefix, newNSname) {
    let res = await fetch(
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

    return res;
  }
}
