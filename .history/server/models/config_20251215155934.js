import mongoose from "mongoose";

const DBURL = process.env.DB_URL;

mongoose.connect(DBURL).then(())