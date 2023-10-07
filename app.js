const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// MIDDLEWARES
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json()); // permite guardar dados no req da requisição POST

//  ROUTE HANDLERS

// User Source

// ROUTES

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id");
// app.delete("/api/v1/tours/:id");
// app.use("/api/v1/", tourRouter);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  // 1ª tratamento de erro
  // res.status(404).json({
  //   status: "fail",
  //   message: `Cannot find (${req.originalUrl})on this Server!!!`,
  // });
  // 2º mockando  erro
  // const err = new Error(`Cannot find (${req.originalUrl})on this Server!!!`);
  // err.status = "fail";
  // err.statusCode = 404;

  // 3 tratamento de erro

  next(new AppError(`Cannot find (${req.originalUrl})on this Server!!!`, 404));
});

app.use(globalErrorHandler);
// START SERVER

module.exports = app;
