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
  async sendSparqlQuery(url, queryText) {
    let data = await fetch(url, {
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

  //   // Controlling if server response contains error
  //   async errorHandler(res, queryType, ref) {
  //     if (!res.ok) {
  //       // something went wrong on server (status like: 4xx or 5xx, ...)
  //       ref.$toast.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: "Error happened during execution!",
  //         life: 3000,
  //       });
  //     } else {
  //       ref.$toast.add({
  //         severity: "success",
  //         summary: "Success Message",
  //         detail: "Query was successfully executed!",
  //         life: 3000,
  //       });
  //       if (queryType != "construct") {
  //         return await res.json();
  //       } else {
  //         return await res.text();
  //       }
  //     }
  //   }

  // Data upload to server
  async uploadDataToServer(url, data, selectedFormat) {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": selectedFormat,
      },
      body: data,
    })
      .then((res) => res)
      .catch((error) => error);
    return response;
  }

  // Fetching RDF data from URL
  async fetchDataFromUrl(url, ref) {
    let data = await fetch(url, {
      method: "GET",
      headers: {},
    })
      .then((res) => res)
      .catch((error) => error);
    return data;
  }

  async removeNamespaceFromRepo(url, prefixToRemove) {
    let res = await fetch(url + prefixToRemove, {
      method: "DELETE",
    })
      .then((response) => response)
      .catch((error) => error);
    return res;
  }

  async createNamespace(url, newNSprefix, newNSname) {
    let res = await fetch(url + newNSprefix, {
      method: "PUT",
      headers: {
        "Content-Type": "text/plain",
      },
      body: newNSname,
    })
      .then((res) => res)
      .catch((error) => error);

    return res;
  }
}
