const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // Acesso como administrador
  // const newUser = await User.create(req.body);

  // acesso como usuario normal, sem muito direitos

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = await req.body;

  // i check if email and password exist
  if (!email || !password) {
    return next(new AppError(`Please, provide email and password`, 401));
  }
  // ii check if user exist and password is match with one
  const user = await User.findOne({ email }).select("+password");
  const check = await user.correctPassword(password, user.password);

  console.log(user);
  console.log(check);

  if (!user || !check) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token2 = signToken(user._id);

  // iii compare and then, if all is ok,  send token to client

  res.status(200).json({
    status: "success",
    token2,
  });
});
