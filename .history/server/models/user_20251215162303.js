import { channel } from "diagnostics_channel";
import mongoose from "mongoose";
import { type } from "os";

const userSchema = mongoose.Schema({
    username : {type : String , require : true},
    name : String,
    description : String , 
    channelname : String,
    image : String ,
    joindate : {
        type:Date,
        default : Date
    }
})