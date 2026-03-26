import mongoose from "mongoose";

const DBURL = process.env.DB_URL;

mongoose.connect(DBURL).then(()=>{
    console.log('Data is connected')
}).catch((err)=>{})