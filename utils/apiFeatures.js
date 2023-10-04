class APIFeatures {
  constructor(query, queryStr) {
    // mongoose query(modulo como o Tour, User etc) and queryString from express(from de route)
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ["page", "sort", "limit", "fields"];

    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr), queryStr);

    this.query = this.query.find(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("ratingsAverage");
    }

    return this;
  }

  limiting() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  pagination() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // para page 3 e limit 10 => ... 10-20 ;[20 -30] 30-40; ....
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
