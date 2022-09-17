const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const mongoose = require('mongoose');
// update user
router.put('/:id', async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
       if(req.body.password){
           try {
               const salt = bcryptjs.genSalt(10);
               req.body.password = bcryptjs.hash(req.body.password,salt);
           } catch (error) {
               console.log(error);
           }
        }
 try {
     const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body})
     res.send(user)
 } catch (error) {
     console.log(error);
 }
    }else{
        return res.status(403).json("you can update only your account");
    }
})

// delete user
router.delete('/:id', async (req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){ 
 try {
     await User.findByIdAndDelete(req.params.id)
     res.send("Account Has Been Deleted");
 } catch (error) {
     console.log(error);
 }
    }else{
        return res.status(403).json("you can delete only your account");
    }
})

// get a user
router.get("/",async(req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;
       try {
        const user = userId? await User.findById(userId): await User.findOne({username:username});
        const {password,updatedAt,...others}=user._doc;

        res.send(others);
    } catch (error) {
        console.log(error);
    }
})

// follow a user
router.put('/:id/follow',async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const Currentuser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}});
                await Currentuser.updateOne({$push:{followings:req.params.id}});
                res.send("this user is Followed");
            }else{
                res.send("You Already Followed This User");
            }
        } catch (error) {
            console.log(error);
        }
    }else{
       res.send("You can not follow yourself");
    }
})

// Unfollow a user

router.put('/:id/unfollow',async(req,res)=>{
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const Currentuser = await User.findById(req.body.userId);

            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await Currentuser.updateOne({$pull:{followings:req.params.id}});
                res.send("You unfollow this user");
            }else{
                res.send("You Already unFollowed This User");
            }
        } catch (error) {
            console.log(error);
        }
    }else{
       res.send("You can not unfollow yourself");
    }
})
module.exports = router;