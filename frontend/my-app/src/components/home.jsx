import React from 'react';
import { useRef,useState,useEffect } from 'react';
import axios from 'axios';
import './home.css';

const baseUrl = 'http://localhost:5001'

const Home =()=>{
      const postTitleInputRef=useRef(null);
      const postTextInputRef=useRef(null);
      // const postTitleEditInputRef=useRef(null);
      // const postTextEditInputRef=useRef(null);
      const [loading ,isLoading]=useState(false);
      const [alert,setAlert] = useState(null);
      const [post ,allPosts] = useState([]);
     const [toggleRefresh, setToggleRefresh] = useState(false);

// console.log(postTitleInputRef)
const getAllPosts =async ()=>{
    
    try{
        isLoading(true);
        const response=await axios.get(`${baseUrl}/api/v1/post`);

        isLoading(false);
        console.log(response.data);
      allPosts(response.data)
    //   console.log(allPosts)
            
        
    }
    catch(error){
       console.log(error.data);
       isLoading(false);
    }

}
useEffect(()=>{
   getAllPosts();

   return ()=>{
    
   }
    
},[toggleRefresh])

const submitPostHandler=async (event)=>{
    event.preventDefault();
    // alert("Submit")
    try{
    isLoading(true);
    setAlert(null)
const response =await axios.post(`${baseUrl}/api/v1/post` ,{
    title:postTitleInputRef.current.value,
    text:postTextInputRef.current.value
    
})
isLoading(false)
setAlert(response.data.message)
setToggleRefresh(!toggleRefresh)
console.log(response.data);
setTimeout(() => {
  setAlert("")
}, 2000);

}
catch(error){
isLoading(false)
console.log(error.data);
}
}

const deletePost =async (id) => {
    // id="_"+id;
    console.log(id);
   
    try{
        isLoading(true)
        const response = await axios.delete(`${baseUrl}/api/v1/post/:${id}`);
        console.log(response.data);
        setToggleRefresh(!toggleRefresh)
         isLoading(false)

    } 
    catch(error){
        console.log(error.data);
        setToggleRefresh(!toggleRefresh)
        isLoading(false)

    }
}

// const editPost=async (id) =>{

// console.log(postTitleEditInputRef.current.value)
// }
const SubmitEditPostHandler=async (e)=>{
     e.preventDefault();
     const id=e.target.elements[0].value;
     const title=e.target.elements[1].value;
     const text = e.target.elements[2].value;

     console.log("id is "+id+"title is"+ title,"text s "+text)
     try{
     isLoading(true)
    const response = await axios.put(`${baseUrl}/api/v1/post/${id}`,{
    title: title,
    text: text
      
  })
  isLoading(false)
  console.log(response.data)
  // setAlert(response?.data?.message);
  setToggleRefresh(!toggleRefresh)
     }
     catch(error){
      console.log(error.data);
      isLoading(false)
     }

}
// const submitPost= (event)=>{
//     alert("Submit")
// }
    return(
        
        <div className='big-div'>   
            <form onSubmit={submitPostHandler} className='posting'>
            {/* <label htmlFor='postTitleInput'>Title:</label> */}
            <input type="text" id="postTitleInput" placeholder="Enter title of Post"
            required minLength={2} maxLength={200} ref={postTitleInputRef} className='headingOfPost'/>

           {/* <label htmlFor='postTextInput'>Title:</label> */}
            <textarea id="postTextInput" placeholder="Enter a post" 
            required minLength={2} maxLength={7000} ref={postTextInputRef} className='discriptionOfPost'></textarea>
            <button type='submit' className='submit'>Submit</button>
            <span>
           {alert && alert}   {/*when alert is true message is render on screen */}
          {loading && "Loading..."}
        </span>
        </form>
       <div>
   <div className='postDisplay'>
    <p className='allBlog'>All Blog</p>

           {post.map((posts , index) => (
            
            <div key={posts._id} className='post'>
           
            {posts.isEdit ? (
              <form  onSubmit={SubmitEditPostHandler} className='editPostDiv'>
               <input type='text' disabled value={posts._id} hidden></input>
                <input type="text" id="postTitleInput" placeholder="Enter title of Post" className='editTitle' defaultValue={posts.title} required minLength={2} maxLength={200}></input>
                <textarea id="postTextInput" placeholder="Enter a post" className='editText' required minLength={2} maxLength={7000} defaultValue={posts.text}></textarea>
              <di className="button-div-eidt">
                <button type='submit'>Save</button>
                <button type='button' onClick={(e) => {
                  // Set isEdit to false to exit edit mode
                  posts.isEdit = false;
                  allPosts([...post]); // Assuming allPosts is a function to update the state
                }}>Cancel</button>
       </di>
                <span>
                  {alert && alert} {/*when alert is true message is render on screen */}
                  {loading && "Loading..."}
                </span>
              </form>
            ) : (
              <div>
                <h2 className='title'>{posts.title}</h2>
                <p className='text'>{posts.text}</p>
                <div className='lowerDiv'>
                <button onClick={(e) => { deletePost(posts._id) }}>Delete</button>
                <button onClick={(e) => {
                  // Set isEdit to true to enter edit mode
                  post[index].isEdit = true;
                  allPosts([...post]); // Assuming allPosts is a function to update the state
                }}>Edit</button>
                  </div>
              </div>
            )}
          </div>
  ))}
  </div>
       </div> 

       </div>
       
    )
}


export default Home;
