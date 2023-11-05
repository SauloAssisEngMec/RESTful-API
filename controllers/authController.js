const { promisify } = require("util");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

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
    passwordChangeAt: req.body.passwordChangeAt,
    role: req.body.role,
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

exports.protect = catchAsync(async (req, res, next) => {
  // i get token (send jwt using http header with request) and check if exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);

  if (!token) {
    return next(
      new AppError(
        "You arent login, please login is necessary to log in!!!",
        401
      )
    );
  }
  // ii validate/ verification token (handle erros like expired and invalid token)

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // iii check if user still exist

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The user belong to this token no long exist!!!", 401)
    );
  }

  // iv check if user changed password after the token(jwt) was issued

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User changed recently the password, Log in again please!!!",
        401
      )
    );
  }

  // Grant Access

  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You dont have permission", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // i) get used based on Post email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("theres no user with email adress,", 404));
  }

  // ii generate the random reset token

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // iii send it to users email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `forgot your password? Submit a patch request with your new password and password confirme to: ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (avalid only 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (e) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("there was an error sending email. try again later"),
      500
    );
  }
});

exports.resetPassword = (req, res, next) => {};
