const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage";
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // http://localhost:3000/api/v1/tours?duration[gte]=5 router to use in insominia for lt|gt|lte|gte

  // GETALL
  // const query = Tour.find({});  getAllTours

  // BUILD QUERY
  //filtering
  // const queryObj = { ...req.query };
  // const excludeFields = ["page", "sort", "limit", "fields"];

  // excludeFields.forEach((el) => delete queryObj[el]);

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

  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
  // // console.log(JSON.parse(queryStr), queryStr);

  // let query = Tour.find(JSON.parse(queryStr));

  // FIELD SORTING
  // console.log(req.query);
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   console.log(sortBy);
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort("ratingsAverage");
  // }

  // FIELD LIMITING
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" ");
  //   console.log(fields);
  //   query = query.select(fields);
  // } else {
  //   query = query.select("-__v");
  // }

  // PAGINATION
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;
  // // para page 3 e limit 10 => ... 10-20 ;[20 -30] 30-40; ....
  // query = query.skip(skip).limit(limit);

  // if (req.query.page) {
  //   const numDocuments = await Tour.countDocuments();
  //   if (skip >= numDocuments) throw new Error("This page doesn't exist");
  // }

  // EXECQUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limiting()
    .pagination();
  // const tours = await query;
  const tours = await features.query;

  // SEND RESPONSE

  res.status(200).json({
    status: "success",
    results: tours.length,

    data: {
      tours: tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const id = await req.params.id;
  console.log(id);

  //const tour = await Tour.findOne({ _id: id });
  const tour = await Tour.findById(id);
  res.status(200).json({
    status: "success",

    data: {
      tours: tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({});
  // newTour.save().then(() => {});

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
  // try {

  // } catch (e) {
  //   res.status(400).json({
  //     status: "fail",
  //     message: e.message,
  //   });
  // }
});

exports.updateTour = catchAsync(async (req, res, next) => {
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
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const deleteTour = await Tour.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    data: {
      tour: deleteTour,
    },
  });

  // res.status(500).json({
  //   status: "error",
  //   message: "This deleteTour handler route is not yet defined",
  // });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: "$duration", // usando null vc ver pra geral, mas usando difficulty, por exemplo, vc ver para os niveis de dificuldade existes cada estatitiscas
        numTours: { $sum: 1 },
        sumRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $match: { _id: { $ne: 10 } }, // aqui diz que não pode com id = diccifulty igual a dez
    },
  ]);

  res.status(200).json({
    status: "success",

    data: {
      stats,
    },
  });
});
