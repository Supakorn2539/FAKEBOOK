require("dotenv").config()
const prisma = require("../models/prisma")

async function run(){
    await prisma.$executeRawUnsafe("DROP DATABASE cc18_fakebook")
    await prisma.$executeRawUnsafe("CREATE DATABASE cc18_fakebook")

}
console.log("Reset DB...")
run()