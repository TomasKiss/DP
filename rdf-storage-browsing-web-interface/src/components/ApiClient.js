let config = require("../config.js");

export class ApiClient {
  sendSparqlQuery() {}

  // fetching all namespaces present in the repository
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
      .then((res) => {
        if (!res.ok) {
          this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: "Error happened during fetch of all namespaces!",
          });
        } else {
          return res.json();
        }
      })
      .catch((error) => console.log(error));

    let prefixNsTuples = [];

    // storing namespaces with corresponding prefixes as tuples
    for (let index = 0; index < data.results.bindings.length; index++) {
      prefixNsTuples.push({
        prefix: data.results.bindings[index].prefix.value,
        namespace: data.results.bindings[index].namespace.value,
      });
    }

    return prefixNsTuples;
  }
}
