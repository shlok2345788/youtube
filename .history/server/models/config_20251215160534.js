import mongoose from "mongoose";

const DBURL = process.env.DB_URL;

const mongoose = mongoose
  .connect(DBURL)
  .then(() => {
    console.log("Data is connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose.model();
