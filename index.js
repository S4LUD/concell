const express = require("express");
const app = express();
const mongoose = require("mongoose");
const routes = require(".Routes");
const dotenv = require("dotenv");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

dotenv.config();

mongoose
  .set("strictQuery", false)
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log(err));

app.use(express.json());

app.use("/api/concell", routes);

app.listen(process.env.PORT || 5719);
