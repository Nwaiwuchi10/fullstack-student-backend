const express = require("express");
const bodyParser = require("body-parser");

const colors = require("colors");
const cors = require("cors");
const compression = require("compression");
const dotenv = require("dotenv");
const authRoutes = require("./routes/AuthRoutes");

const mongoose = require("mongoose");
const path = require("path");
const config = require("config");

// const router = express.Router();
const app = express();
app.use(cors());
app.use(
  compression({
    level: 6,
    threshold: 10 * 1000,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);
app.use(bodyParser.json({ limit: "150mb" }));

const db = config.get("mongoURI");

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,

    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => console.log(`MongoDb Connected`.bgGreen.bold))
  .catch((err) => console.log(err));
/////
app.use(express.json());
app.use("/api/auth/", authRoutes);

// app.use(express.static(path.join(__dirname, "/build")));
// app.get("*", (req, res) =>
//   res.sendFile(path.join(__dirname, "build/index.html"))
// );
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
