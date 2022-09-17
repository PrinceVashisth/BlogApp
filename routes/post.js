const router = require('express').Router();
const Post = require('../models/post');
const User = require('../models/user');



// Create a post 
router.post('/', async (req,res)=>{
    const newPosts = new Post({
        userId:req.body.userId,
        desc:req.body.desc,
        img:req.body.img
    });
    try {
    const Posts = await newPosts.save();
    res.send(Posts); 
} catch (error) {
    console.log(error);
    }   
})

// Update a post
router.put('/:id', async (req,res)=>{
    try {
        const Posts =await Post.findById(req.params.id);
        if(Posts.userId === req.body.userId){
          await Posts.updateOne({$set:req.body});
            res.send(Posts);  
        }else{
           res.send("You can update only your post");
        }
    } catch (error) {
        console.log(error);
    }
})

// Like a post
router.put('/:id/like',async(req,res)=>{
       const Posts = await Post.findById(req.params.id);
       try {           
           if(!Posts.likes.includes(req.body.userId)){
               await Posts.updateOne({$push:{likes:req.body.userId}});
               res.send("Post Has Been Liked");
           }else{
            await Posts.updateOne({$pull:{likes:req.body.userId}});
            res.send("Your Like Has Been Removed");
           } 
       } catch (error) {
           console.log(error);
       }
})


// Delete a Post
router.delete('/:id', async (req,res)=>{
    try {
        const Posts =await Post.findById(req.params.id);
        if(Posts.userId === req.body.userId){
          await Posts.deleteOne();
            res.send("You Delete this Post");  
        }else{
           res.send("You can delete only your post");
        }
    } catch (error) {
        console.log(error);
    }
})


// See a Post
router.get("/:id", async(req,res)=>{
    try {
        const Posts = Post.findById(req.params.userId);
        res.send(Posts);

    } catch (error) {
        console.log(error);
    }
})


// Get All User post
router.get("/profile/:username",async(req,res)=>{
    try {
        const Users = await User.findOne({username:req.params.username});
        const userPosts = await Post.find({userId: Users._id});
        res.send(userPosts);         
    } catch (error) {
        console.log(error);
    }
})

// See timeline
router.get("/timeline/:userId",async(req,res)=>{
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId:friendId});
            })
        );
        const TotalPost = userPosts.concat(...friendPosts);
        res.send(TotalPost);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;