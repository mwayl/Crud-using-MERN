import express from 'express';
import path from 'path';
// require("dotenv").config();

const __dirname = path.resolve();
import cors from 'cors';
// import mongodb from 'mongodb';

// import apiv1Router from './apiv1/index.mjs'
// import apiv1Router from './apiv1/indexV1.mjs'
// import apiv2Router from './apiv2/indexV2.mjs'

import authRouter from './apiv1/routes/auth.mjs' 
import postRouter from './apiv1/routes/post.mjs'
// import commentRouter from './routes/comment.mjs'
// import feedRouter from './routes/feed.mjs'

const app = express();
app.use(express.json()); // body parser
// app.use(cors())



app.use(cors());
app.use(express.static(path.join(__dirname, './../frontend/my-app/build')))

app.use("/api/v1", authRouter)



app.use((req, res,next) => {
    let token = "valid";
    if(token=== "valid"){
        next();
    }
    else{
        res.send({message : "Invalid token"})
    }
})


app.use("/api/v1", postRouter)








// app.get('/',(req,res,next)=>{
//     res.sendFile(path.join(__dirname,'main.html'))
// })
// app.use(express.static(path.join(__dirname,'main.html')))
// app.get('/',(req,res,next)=>{
//     //res.sendFile(path.join(__dirname,'html and css v1/postaddv1.html'))

// })
// app.use(express.static(path.join(__dirname,'html and css v1')))





const port=process.env.PORT || 5001;

app.listen(port,()=>{
    console.log("listning the port")
})