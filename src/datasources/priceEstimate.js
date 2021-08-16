const {RESTDataSource} = require("apollo-datasource-rest")

class PriceEstimateAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:3001/estimate"
  }

  async getPriceEstimate() {
    const res = await this.get('price')
    return res.curPrice
  }
}

module.exports = PriceEstimateAPI