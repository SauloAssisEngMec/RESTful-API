const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `this is Invalid!!!: Look ${err.path} ${err.value}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token, please login again", 401);

const handleJWTExpiredError = () =>
  new AppError("Expired token, please login again", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // let error = { ...err };
    // let error = { ...err, name: err.name };
    let error = Object.assign(err);

    if (error.name === "CastError") error = handleCastErrorDB(error);

    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    // if (err.name === "CastError") err = handleCastErrorDB(err);
    sendErrorProd(error, res);
  }
};
