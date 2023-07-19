const express=require("express")
const { userModel } = require("../models/user.model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const userRouter=express.Router()

// to create new user acccount

userRouter.post("/register",async(req,res)=>{
    console.log(req.body)
    const {username,email,password}=req.body
    try {
        const user=await userModel.findOne({email})
        if(user){
            res.status(400).json({msg:"User already exists! Please Login."})
        }else{
            bcrypt.hash(password, 5,async(err, hash)=>{
                // Store hash in your password DB.
                if(err){
                    res.status(400).json({error:err})
                }else{
                    const newUser=new userModel({username,email,password:hash})
                    await newUser.save()
                    res.status(200).json({msg:"Account created Successfully"})
                }
            });
        }
        
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

// to login the existed user

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await userModel.findOne({email})
        if(user){
            bcrypt.compare(password, user.password,(err, result)=>{
                // result == true
                if(result){
                  const token=jwt.sign({userID:user._id},process.env.secretKey)
                  res.status(200).json({msg:"Login Success",token:token,user:user})
                }else{
                    res.status(400).json({err:err})
                }
            });

        }else{
            res.status(400).json({err:"User does not exists! Please register"})
        }
        
    } catch (error) {
        res.status(400).json({err:error.message})
    }
})

module.exports={
    userRouter
}