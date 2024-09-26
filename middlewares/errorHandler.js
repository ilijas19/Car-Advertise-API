const { StatusCodes } = require("http-status-codes");
const { CustomApiError } = require("../errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomApiError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  if (err.name === "CastError") {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Error id syntax" });
  }
  if (err.name === "TypeError") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Try logging again" });
  }
  if (err.code && err.code === 11000) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: `Duplicate value entered for ${Object.keys(
        err.keyValue
      )} field, please chose another value`,
    });
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "Something Went wrong" });
};

module.exports = errorHandlerMiddleware;
