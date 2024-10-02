const prisma = require("../models/prisma")
const tryCatch = require("../utils/tryCatch")
const createError = require("../utils/createError")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
function checkEmailorPhone(identity){
    let identityKey = ""
    if(/^[0-9]{10,15}$/.test(identity)){
        identityKey = "phone"
    }
    if(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(identity)){
        identityKey = "email"
    }
    if(!identityKey){
        return createError(400,"only email or phone ")
    }
    return identityKey
}
module.exports.register = tryCatch(async(req,res) => {
    const {identity, firstName , lastName , password , confirmPassword } = req.body
    //validation
    if(!(identity.trim() && firstName.trim() && lastName && password && confirmPassword)){
        const err = new Error
       return createError(400,"Please fill all data")
    }
    if(password !== confirmPassword){
        return createError(400,"check confirm Password")
    }
    //check identity is mobile or email
    const identityKey = checkEmailorPhone(identity)
    
    
    // check already email / phone in User data
    const findIdentity = await prisma.user.findUnique({
        where : {
            [identityKey] : identity
        }
    })
    if(findIdentity){
        return createError(409,`Already have this user ${identityKey}`)
    }
    // create user in db
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = {
    [identityKey] : identity,
    password : hashedPassword,
    firstName,
    lastName}
    const result = await prisma.user.create({
        data : {
            [identityKey] : identity,
            firstName,
            lastName,
            password : hashedPassword
        }, 
        select : {
            [identityKey] : true,
            firstName : true,
            lastName : true
        }
    })
    res.json(200,{message : "Register successful",result})
})

module.exports.login = tryCatch(async(req,res) => {
    const {identity,password} = req.body
    
    // validation
    if(!(identity.trim()&& password.trim())){
        return createError(400,"Please Fill all data")
    }
    // check identity is mobile or email

    const identityKey = checkEmailorPhone(identity)
    // find user
    const findUser = await prisma.user.findUnique({
        where : {
            [identityKey] : identity,

        }
    })
    if(!findUser){
        return createError(401,"Invalid login")
    }
    let isMatch = await bcrypt.compare(password,findUser.password)
    if(!isMatch){
        return createError(401,"Invalid login")
    }
    const payload = {
        id : findUser.id
    }
    const token = jwt.sign(payload,process.env.JWT_KEY,{
        expiresIn : "30d"
    })
    res.json({token})
})


module.exports.getMe = tryCatch(async(req,res,next) =>{
    const rs = await prisma.user.findMany()
    console.log(rs)
    res.json({result : rs})
})

