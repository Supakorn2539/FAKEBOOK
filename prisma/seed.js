const bcrypt = require('bcryptjs')
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()


const hashedPassword =  bcrypt.hashSync("12345",10)

const userData = [
    {firstName : "Andy", lastName : "Codecamp", password : hashedPassword, email: "andy@ggg.mail"},
    {firstName : "Bobby", lastName : "Codecamp", password : hashedPassword, email: "bobdy@ggg.mail"},
    {firstName : "Candy", lastName : "Codecamp", password : hashedPassword, phone : "1111111111"},
    {firstName : "Sindy", lastName : "Codecamp", password : hashedPassword, phone : "2222222222"},
]

console.log("DB Seed...")

async function run(){
    await prisma.user.createMany({
        data : userData
    })
}

run()