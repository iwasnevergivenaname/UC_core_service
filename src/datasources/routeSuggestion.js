const {RESTDataSource} = require("apollo-datasource-rest")

class RouteSuggestionAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:3002/routing"
  }

//  get the route suggestion
}

module.exports = RouteSuggestionAPI