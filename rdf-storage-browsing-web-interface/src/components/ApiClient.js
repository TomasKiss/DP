let config = require("../config.js");

export class ApiClient {
  // fetching all namespaces present in the repository
  async queryAllNamespaces(repo, ref) {
    const data = await fetch(
      config.server_url + "api/r/" + repo + "/repository/namespaces",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          ref.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "Error happened during fetch of all namespaces!",
          });
        } else {
          return res.json();
        }
      })
      .catch((error) => console.log(error));

    // storing namespaces with corresponding prefixes as tuples
    for (let index = 0; index < data.results.bindings.length; index++) {
      ref.prefixNsTuples.push({
        prefix: data.results.bindings[index].prefix.value,
        namespace: data.results.bindings[index].namespace.value,
      });
    }
  }

  async sendSparqlQuery(url, queryText, queryType, ref) {
    let data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/sparql-query",
      },
      body: queryText,
    })
      .then((res) => this.errorHandler(res, queryType, ref))
      .catch((error) =>
        ref.$toast.add({ severity: "error", summary: "Error", detail: error })
      );

    return data;
  }

  // controlling if server response contains error
  async errorHandler(res, queryType, ref) {
    if (!res.ok) {
      // something went wrong on server (status like: 4xx or 5xx, ...)
      ref.$toast.add({
        severity: "error",
        summary: "Error",
        detail: "Error happened during execution!",
        life: 3000,
      });
    } else {
      ref.$toast.add({
        severity: "success",
        summary: "Success Message",
        detail: "Query was successfully executed!",
        life: 3000,
      });
      if (queryType != "construct") {
        return await res.json();
      } else {
        return await res.text();
      }
    }
  }
}
