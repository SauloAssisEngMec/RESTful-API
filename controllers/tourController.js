const fs = require("fs");
const Tour = require("./../models/tourModel");

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage";
  next();
};

exports.getAllTours = async (req, res) => {
  // http://localhost:3000/api/v1/tours?duration[gte]=5 router to use in insominia for lt|gt|lte|gte
  try {
    // GETALL
    // const query = Tour.find({});  getAllTours

    // BUILD QUERY
    //filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];

    excludeFields.forEach((el) => delete queryObj[el]);

    // const query = Tour.find({
    //   duration: 5,
    //   // difficulty: "easy", precisa deletar tudo e melhorar o model tour para depois importar todos dados novamente
    // });
    // const query = Tour.find({
    //   duration: { $lte: 5 },
    // });

    // const tours = await Tour.find({}).where("duration").equals(5);
    // const tours = await Tour.find({}).where("duration").lte(5);

    // 2 advanc filtering (using regular expression)

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr), queryStr);

    let query = Tour.find(JSON.parse(queryStr));

    // FIELD SORTING
    console.log(req.query);
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort("ratingsAverage");
    }

    // FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      console.log(fields);
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // para page 3 e limit 10 => ... 10-20 ;[20 -30] 30-40; ....
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numDocuments = await Tour.countDocuments();
      if (skip >= numDocuments) throw new Error("This page doesn't exist");
    }

    // EXECQUERY

    const tours = await query;

    // SEND RESPONSE

    res.status(200).json({
      status: "success",
      results: tours.length,

      data: {
        tours: tours,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e.message,
    });
  }
};

exports.getTour = async (req, res) => {
  const id = await req.params.id;
  console.log(id);

  try {
    //const tour = await Tour.findOne({ _id: id });
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: "success",

      data: {
        tours: tour,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e.message,
    });
  }
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({});
  // newTour.save().then(() => {});
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const deleteTour = await Tour.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        tour: deleteTour,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e.message,
    });
  }
  // res.status(500).json({
  //   status: "error",
  //   message: "This deleteTour handler route is not yet defined",
  // });
};
