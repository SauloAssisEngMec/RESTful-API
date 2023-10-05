const express = require("express");
const morgan = require("morgan");
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

// START SERVER

module.exports = app;
