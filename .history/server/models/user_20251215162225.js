import { channel } from "diagnostics_channel";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username : {type : String , require : true},
    name : String,
    description : String , 
    channelname : String,
    image : 
})