require("express-async-errors");
require("dotenv").config();

const express = require("express");
const app = express();

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

//DB
const connectDb = require("./db/connectDb");

//MIDDLEWARES
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const auth = require("./middlewares/auth");

//ROUTERS
const userRouter = require("./routes/usersRouter");
const carRouter = require("./routes/carsRouter");
//APP.USE
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  })
);
// extra packagess
app.use(helmet());
app.use(cors());
app.use(xss());
app.get("/", (req, res) => {
  res.send("<h1>Jobs API</h1><a href='/api-docs'>Documentation</a>");
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
/////
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/cars", auth, carRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.port || 3000;
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`app is listening on port ${port}`);
    });
  } catch (error) {}
};

start();
