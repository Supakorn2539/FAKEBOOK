const express = require("express")
const notfuount = require("./middlewares/notfuount")
const errorMiddleware = require("./middlewares/error")
const app = express()
require("dotenv").config()
const authRoute = require("./routes/auth-route")
const postRoute = require("./routes/post-route")

app.use(express.json())

app.use("/auth", authRoute)
app.use("/post", postRoute)
app.use("/comment", (req,res)=>{})
app.use("/like", (req,res)=>{})

app.use(notfuount)
app.use(errorMiddleware)
const port = process.env.PORT || 8000
app.listen(port,()=>console.log(`Server is running ${port}`))