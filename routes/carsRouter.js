const express = require("express");
const router = express.Router();

const {
  getAllCars,
  createCar,
  getCar,
  updateCar,
  deleteCar,
} = require("../controllers/carsController");

router.route("/").get(getAllCars).post(createCar);
router.route("/:id").get(getCar).patch(updateCar).delete(deleteCar);

module.exports = router;
