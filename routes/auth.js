const router = require('express').Router();
const User = require('../models/user');
const bcryptjs = require('bcryptjs')


router.post('/register', async (req,res)=>{
   try {    
      // Generate new password
      const salt = await bcryptjs.genSalt(10)
      const hashedpassword = await bcryptjs.hash(req.body.password,salt);
  const newUser = await new User({
     username:req.body.username,
     email:req.body.email,
     password:hashedpassword
   })
// save user details
   const data =await newUser.save();
     console.log(data);
     res.send('ok')
  } catch (error) {
     res.status(500).json(error)
   }
})

// LOGIN

router.post('/login',async (req,res)=>{
   try {
      const user = await User.findOne({email:req.body.email});
      !user && res.status(404).json('user not found');

      const validPassword = await bcryptjs.compare(req.body.password,user.password)
      !validPassword && res.status(400).json("in correct password")

      res.send(user)
   } catch (error) {
      res.status(500).json(error)
   }
})

module.exports = router;
