// db.ts (or mongoose.ts)
import mongoose from "mongoose";

const DBURL = process.env.DB_URL;

mongoose
  .connect(DBURL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
});

export default mongoose;
