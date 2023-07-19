const mongoose=require("mongoose")
require("dotenv").config()

const connection=mongoose.connect(process.env.db_URL)

module.exports={
    connection
}