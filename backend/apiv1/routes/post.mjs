import { nanoid } from 'nanoid'
import express from 'express';
import {client} from './../../mongodb.mjs' 
import { ObjectId } from 'mongodb'
let router = express.Router()

const db = client.db("cruddb")
const col =db.collection("posts")
// not recommended at all - server should be stateless
// let posts = [
//     {
//         id: nanoid(),
//         title: "abc post title",
//         text: "some post text"
//     }
// ]

// POST    /api/v1/post
router.post('/post',async (req, res) => {
    console.log('this is signup!', new Date());
    
    if (
        !req.body.title
        || !req.body.text
    ) {
        res.status(403);
        res.send({message :`required parameters missing, 
        example request body:
        {
            title: "abc post title",
            text: "some post text"
        } `});
        return;
    }

    await col.insertOne({
        title:req.body.title,
        text:req.body.text
      });

    res.send({message :'post created'});
})


// GET     /api/v1/posts
router.get('/post',async (req, res, next) => {
    console.log('this is signup!', new Date());
    const cursor = col.find() .sort({ _id: -1 })
    .limit(100);
    try{
        let postArray =await cursor.toArray();
        console.log('result', postArray)
        res.send(postArray);
    }
    catch(error){
        console.log('error getting in mongodb', error)
        res.status(500).send({message :"server does not respond! please try again later"});
    }
    

})

// GET     /api/v1/post/:postId
router.get('/post/:postId',async (req, res, next) => {
    console.log('this is signup!', new Date());

    // if (isNaN(req.params.postId)) {
    //     res.status(403).send(`post id must be a valid number, no alphabet is allowed in post id`)
    // }
//     let i
    let getId=req.params.postId
    let getIdupdate=getId.slice(1)
//    console.log(getIdupdate)
if (!ObjectId.isValid(getIdupdate)) {
    res.status(403).send({message :`Invalid post id`});
    return;
}

   try{
    const post=await col.findOne({_id: new ObjectId(getIdupdate)});
      res.send(post);
   }
   catch(err){
    console.log('error getting in mongodb', err)
    res.status(500).send({message :"server does not respond! please try again later"});
   }

//    console.log(posts[i].id)
    // for (i = 0; i < posts.length; i++) {
    //     console.log(typeof(posts[i].id))
    //     if (posts[i].id === getId.slice(1)) {
    //         res.send(posts[i]);
    //         return;
    //     }
    // }
    // // console.log(typeof(posts[i].id))
    // //   console.log(typeof(req.params.postId))
    // res.send('post not found with id ' + req.params.postId);
})

// PUT     /api/v1/post/:userId/:postId
router.put('/post/:postId',async (req, res, next) => {
    const getId = req.params.postId;
    // const updateId=getId.slice(1)   this line is run when we use thunder client
    // console.log(getId);
    // new ObjectId(updateId)
    if(!ObjectId.isValid(getId)){
        res.status(500).send({message :"post not found with this id"})
    }
    if(!req.body.title && !req.body.text){
        console.log("not any fiels is given");
        res.status("22").send({message :"please enter one field for updation"});
    }
    let updateWork ={title:"",text:""};
    if(req.body.title && req.body.text){
        updateWork.title = req.body.title
        updateWork.text = req.body.text
    }
    if(!req.body.text){updateWork.title = req.body.title}
    if(!req.body.title){updateWork.title = req.body.text}
    try{
        

         const update=await col.updateOne({_id:new ObjectId(getId)},{$set :updateWork})
            console.log("update " +update)
            res.send({message :'post is  updated successfully'})
    }
    catch(error){

    }

//     for (let i = 0; i < posts.length; i++) {
//         if (posts[i].id === getId.slice(1)) {
//             let titles = posts[i].title;
//             let texts = posts[i].text;

//             // Check if both title and text are missing in the request body
//             if (!req.body.title && !req.body.text) {
//                 return res.status(400).send("Both title and text are missing in the request.");
//             }

//             // Update the post properties if title is provided
//             if (req.body.title) {
//                 titles = req.body.title;
//             }

//             // Update the post properties if text is provided
//             if (req.body.text) {
//                 texts = req.body.text;
//             }

//             // Update the post in the array
//             posts[i] = {
//                 id: posts[i].id,
//                 title: titles,
//                 text: texts
//             };

//             // Send a success response
//             return res.send({
//                 id: posts[i].id,
//                 title: titles,
//                 text: texts
//             });
//         }
//     }

//     // If the loop completes without finding a matching post, send a not found response
//     res.status(404).send('Post not found with this ID.');
});
// DELETE  /api/v1/post/:userId/:postId
router.delete('/post/:postId',async (req, res, next) => {
    console.log('this is signup!', new Date());
 
    let getId=req.params.postId
    console.log('getId', getId)
     getId=getId.slice(1)
if(!ObjectId.isValid(getId)){
    res.status(500).send({message :"post not found with this id"})
}

try{
    
    let deletedItem=await col.deleteOne({_id : new ObjectId(getId)})
    // amount deleted code goes here
console.log("Number of documents deleted: " + deletedItem);

res.send({message :"post is deleted of "+ req.params.postId})


}
catch(error){
     console.log(error)
}
    // let getId=req.params.postId
   

    //  for (let i=0 ;i<posts.length;i++){
    //     if(posts[i].id === getId.slice(1)){
    //         // res.send(posts[i])
    //         posts.splice(i,1)
    //         res.send("post delete of id "+ getId.slice(1))

    //         return
    //     }
    //  }



    // res.send('post not found with this index');
})

export default router



