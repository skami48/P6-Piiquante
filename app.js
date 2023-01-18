const express = require("express");
const mongoose = require("mongoose");


const UserRoutes = require("./routes/userAuth");
const sauceRoute = require("./routes/sauceRoute");



mongoose.set("strictQuery", false);
mongoose.connect(/*MongoDB URI*/)
                .then(()=> console.log("connection a mongoDB reussit"))
                .catch((err)=> console.log("connection echouée a MongoDB ${err}",err))

const app = express();

app.use(express.json());




app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use("/api/sauces",sauceRoute);
app.use("/api/auth",UserRoutes);


const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));




module.exports = app;