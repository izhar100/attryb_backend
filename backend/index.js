const express=require("express")
const app=express()
app.use(express.json())
const cors=require("cors")
const { connection } = require("./config/db")
const { userRouter } = require("./routes/user.router")
const { oemRouter } = require("./routes/oemSpecs.router")
const { inventoryRouter } = require("./routes/inventory.route")
app.use(cors())
require("dotenv").config()
app.use("/user",userRouter)
app.use("/spec",oemRouter)
app.use("/inventory",inventoryRouter)

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("connected to database")
        console.log(`server is running at port ${process.env.port}`)
    } catch (error) {
        console.log(error.message)
    }
})