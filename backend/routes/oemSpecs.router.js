const express=require("express")
const { oemSpecsModel } = require("../models/oemSpecs.model")
const oemRouter=express.Router()

oemRouter.post("/add",async(req,res)=>{
    try {
        const car=new oemSpecsModel(req.body)
        await car.save()
        res.status(200).json({msg:"oem Spec added",data:req.body})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

//to get oemSpecs

oemRouter.get("/",async(req,res)=>{
  const { search } = req.query;
  try {
    if (search) {
      let specs = await oemSpecsModel.find({
        $or: [
          { modelName: { $regex: search, $options: "i" } },
          { modelYear: { $regex: search, $options: "i" } },
          { colors: { $regex: search, $options: "i" } },
        ],
      });
      res.status(200).send({ specs });
    } else {
      let specs = await oemSpecsModel.find({});
      res.send({ specs });
    }
  } catch (error) {
    res.send({ error });
  }
})

module.exports={
    oemRouter
}