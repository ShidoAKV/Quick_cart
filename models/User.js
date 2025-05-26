import mongoose from "mongoose";


const userSchema=new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    imageUrl:{
        type:String,
        default:'https://th.bing.com/th/id/OIP.CuH_kp6AL_Z3CIZAfzPbmQHaGe?w=3683&h=3223&rs=1&pid=ImgDetMain'
    },
    cartItems:{
        type:Object,
        default:{}
    },

},{minimize:false})


const User=mongoose.models.User||mongoose.model('User',userSchema);

export default User;
