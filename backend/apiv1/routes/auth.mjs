import express from 'express'
import path from 'path'
let router=express.Router()
const __dirname = path.resolve();


router.get('/login',(req,res,next)=>{
    // console.log("this is login v1" + new Date())
    // res.send("this is login v1"+new Date())

    // res.sendFile(path.join(__dirname,'loginv1.html'))
    res.sendFile(path.join(__dirname,'html and css v1/loginv1.html'))

})

router.get('/signup',(req,res,next)=>{
    // console.log("this is signup v1" + new Date())
    // res.send("this is signup v1"+new Date())

    res.sendFile(path.join(__dirname,'html and css v1/signinv1.html'))
    
})

export default router;