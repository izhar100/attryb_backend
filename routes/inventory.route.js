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
    console.log("order:",order,"filter:",filter)
    try {
        if(filter=="price"){
            let inventory;
            if(order=="asc"){
                inventory=await inventoryModel.find({}).populate("oemId").sort({price:1})

            }else{
                inventory=await inventoryModel.find({}).populate("oemId").sort({price:-1})
            }
            res.status(200).json({inventory:inventory})
        }else if(filter=="mileage"){
            let inventory = await inventoryModel.find({}).populate("oemId").lean();
            if(order=="asc"){
                inventory=inventory.sort((a,b)=>a.oemId.mileage-b.oemId.mileage)
            }else{
                inventory=inventory.sort((a,b)=>b.oemId.mileage-a.oemId.mileage)
            }
            res.status(200).json({inventory:inventory})

        }else if(filter=="colors" && order){
            let inventory = await inventoryModel.find({}).populate({
                path: "oemId",
            });
            inventory=inventory.filter((el)=>{
                return el.oemId.colors.includes(order)
            })
            res.status(200).json({inventory:inventory})
        }else{
            let inventory = await inventoryModel.find({}).populate({
                path: "oemId",
            });
            res.status(200).json({inventory:inventory})
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