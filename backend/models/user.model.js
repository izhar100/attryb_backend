const mongoose=require("mongoose")

const useSchema=mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
},{
    versionKey:false
})

const userModel=mongoose.model("user",useSchema)

module.exports={
    userModel
}