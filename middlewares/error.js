module.exports = (err,req,res,next) => {
    const statuscode = err.statusCode || 500
    res.status(statuscode).json({error : err.message})
}