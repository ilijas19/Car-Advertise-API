//RUN ONLY ONCE SINCE IT WILL DELETE EVERYTHING FROM DATABASE !!!!!!
require("dotenv").config();
const Car = require("./models/carSchema");
const connectDb = require("./db/connectDb");
const cars = require("./cars.json");

const start = async () => {
  try {
    connectDb(process.env.MONGO_URI);
    await Car.deleteMany();
    await Car.create(cars);
    console.log("success");
    process.exit(0);
  } catch (error) {
    console.log("fail populating");
    process.exit(1);
  }
};
// start();
