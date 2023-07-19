const express=require("express")
const { inventoryModel } = require("../models/inventory.model")
const { auth } = require("../middleware/auth.middleware")
const inventoryRouter=express.Router()

//to add inventory

inventoryRouter.post("/add",auth,(req,res)=>{
    try {
        const inventory=new inventoryModel(req.body)
        inventory.save()
        res.status(200).json({msg:"New Inventory Added",data:inventory})
    } catch (error) {
       res.status(400).json({err:error.message})
    }
})

//to get inventory

inventoryRouter.get("/",async(req,res)=>{
    const { order, filter} = req.query;
    try {
        if(filter=="price"){
            let inventory;
            if(order=="asc"){
                inventory=await inventoryModel.find({}).populate("oemId").sort({price:1})

            }else{
                inventory=await inventoryModel.find({}).populate("oemId").sort({price:-1})
            }
            if(inventory.length>0){
                res.status(200).json({inventory:inventory})
            }else{
                res.status(400).json({msg:"No inventory found"})
            }
        }else if(filter=="mileage"){
            let inventory = await inventoryModel.find({}).populate("oemId").lean();
            if(order=="asc"){
                inventory=inventory.sort((a,b)=>a.oemId.mileage-b.oemId.mileage)
            }else{
                inventory=inventory.sort((a,b)=>b.oemId.mileage-a.oemId.mileage)
            }
            if(inventory.length>0){
                res.status(200).json({inventory:inventory})
            }else{
                res.status(400).json({msg:"No inventory found"})
            }

        }else if(filter=="colors"){
            let inventory = await inventoryModel.find({}).populate({
                path: "oemId",
                match: { colors: { $regex: order, $options: "i" } },
            });
            if(inventory.length>0){
                res.status(200).json({inventory:inventory})
            }else{
                res.status(400).json({msg:"No inventory found"})
            }
        }else{
            let inventory = await inventoryModel.find({}).populate({
                path: "oemId",
            });
            if(inventory.length>0){
                res.status(200).json({inventory:inventory})
            }else{
                res.status(400).json({msg:"No inventory found"})
            }
        }
        
    } catch (error) {
        res.status(400).json({err:error.message})
    }
})

// to update inventory

inventoryRouter.patch("/update/:id",async(req,res)=>{
  const { id } = req.params;
  try {
    await inventoryModel.findByIdAndUpdate(id, req.body);
    res.status(200).send({ msg: "Inventory updated" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
})

// to delete inventory

inventoryRouter.delete("/delete/:id",async(req,res)=>{
  const { id } = req.params;
  try {
    await inventoryModel.findByIdAndDelete({_id:id});
    res.status(200).send({ msg: "Inventory deleted" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
})

module.exports={
    inventoryRouter
}