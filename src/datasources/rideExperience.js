const {RESTDataSource} = require("apollo-datasource-rest")

class RideExperienceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:3003/ride"
  }

//   get the ride experience
}

module.exports = RideExperienceAPI