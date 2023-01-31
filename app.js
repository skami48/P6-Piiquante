const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();


const UserRoutes = require("./routes/userAuth");
const sauceRoute = require("./routes/sauceRoute");



mongoose.set("strictQuery", false);
// eslint-disable-next-line no-undef
mongoose.connect(process.env.MONGODBCONNECTION)
                .then(()=> console.log("connection a mongoDB reussit"))
                .catch((err)=> console.log("connection echouée a MongoDB ${err}",err));

const app = express();

app.use(express.json());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "same-site" }
}));



app.use((req, res, next) => {
  // eslint-disable-next-line no-undef
    res.setHeader("Access-Control-Allow-Origin", process.env.PIQUANTEWEBSITE);
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
  });

app.use("/api/sauces",sauceRoute);
app.use("/api/auth",UserRoutes);


const path = require("path");
// eslint-disable-next-line no-undef
app.use("/images", express.static(path.join(__dirname, "images")));




module.exports = app;