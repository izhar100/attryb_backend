const mongoose=require("mongoose")
const oemSpecsSchema=mongoose.Schema({
    modelName:{type:String,required:true},
    modelYear:{type:String,required:true},
    listPrice:{type:Number,required:true},
    colors:{type:Array,required:true},
    mileage:{type:Number,required:true},
    power:{type:Number,required:true},
    maxSpeed:{type:Number,required:true},
    image:{type:String}
},{
    versionKey:false
})

const oemSpecsModel=mongoose.model("oemSpecs",oemSpecsSchema)

module.exports={
    oemSpecsModel
}