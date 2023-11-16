require("dotenv").config();

const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
const propertiesRoutes = require("./routes/Properties.js");
const userRoutes = require("./routes/User.js");

// express app
const app = express();

const keep_alive = require("./keep_alive.js");
// middelware
app.use(express.json());

app.use(express.static("public"));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(cors());

// routes
app.use("/api/properties", propertiesRoutes);
app.use("/api/user", userRoutes);

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for request
    app.listen(process.env.PORT || 4000, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
