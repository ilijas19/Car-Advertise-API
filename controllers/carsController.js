const Car = require("../models/carSchema");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllCars = async (req, res) => {
  const { make, model, sort, numericFilters } = req.query;
  const carObject = {};
  if (make) {
    carObject.make = make;
  }
  if (model) {
    carObject.model = { $regex: model, $options: "i" };
  }
  if (numericFilters) {
    const operatorMap = {
      "<": "$lt",
      "<=": "$lte",
      "=": "$eq",
      ">": "$gt",
      ">=": "$gte",
    };
    const regex = /(<=|>=|<|>|=)/g;
    const match = numericFilters.match(regex);
    const options = ["price", "year"];
    const [field, operator, value] = numericFilters
      .replace(match, `-${operatorMap[match]}-`)
      .split("-");
    if (options.includes(field)) {
      carObject[field] = { [operator]: Number(value) };
    }
  }
  const result = Car.find(carObject);
  if (sort) {
    result.sort(sort);
  }
  const cars = await result;
  res.status(StatusCodes.OK).json({ msg: "Success", cars });
};
const createCar = async (req, res) => {
  //creator
  req.body.createdBy = req.user.id;
  const car = await Car.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ msg: "Success", car });
};

const getCar = async (req, res) => {
  const { id } = req.params;
  const car = await Car.findOne({ _id: id, createdBy: req.user.id });
  if (!car) {
    throw new NotFoundError(`No Car with id: ${id} in your advertised cars`);
  }
  res.status(StatusCodes.OK).json({ msg: "Success", car });
};

const updateCar = async (req, res) => {
  const { id } = req.params;
  const car = await Car.findOneAndUpdate(
    { _id: id, createdBy: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!car) {
    throw new NotFoundError(`No Car with id: ${id} in your advertised cars`);
  }
  res.status(StatusCodes.OK).json({ msg: "Success", car });
};

const deleteCar = async (req, res) => {
  const { id } = req.params;
  const car = await Car.findOneAndDelete({ _id: id, createdBy: req.user.id });
  if (!car) {
    throw new NotFoundError(`No Car with id: ${id} in your advertised cars`);
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: `Deleted Car With ID: ${id} from your advertised cars` });
};

module.exports = {
  getAllCars,
  createCar,
  getCar,
  updateCar,
  deleteCar,
};
