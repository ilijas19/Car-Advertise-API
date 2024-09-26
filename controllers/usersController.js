const User = require("../models/userSchema");
const { StatusCodes } = require("http-status-codes");

const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");

const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("email and password must be provided");
  }
  const user = await User.create({ ...req.body });
  const token = user.createJwt();
  res
    .status(StatusCodes.CREATED)
    .json({ msg: `Hello ${user.name}`, jwt: token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("email and password must be provided");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new NotFoundError("No user with specified email");
  }
  const isLogged = await user.comparePassword(password);
  if (!isLogged) {
    throw new UnauthenticatedError("Password not correct");
  }
  const token = user.createJwt();

  res.status(StatusCodes.OK).json({ msg: `Hello ${user.name}`, jwt: token });
};

module.exports = { login, register };
