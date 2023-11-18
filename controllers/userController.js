const {User ,validationRegisterUser, validationLoginUser} = require('../models/user');
const asynchandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');





/**
 * @desc        registration
 * @route       /user/
 * @method      POST
 * @access      public
 */
const registerController =  asynchandler(async (req, res)=>{
    let data = req.body;
    
    const {error} = await validationRegisterUser(data);
    if (error){
        res.status(400).json({message: error.details[0].message});
    }
    const user = new User(data)
    const salt = await bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    user.save()
    res.status(201).json(user) 
})




/**
 * @description         login user
 * @route               /user/login
 * @method              POST
 * @access              public
 */
const loginController = asynchandler(async (req, res)=>{
    let data = req.body
    const {error} = await validationLoginUser(data);
    if(error){
        res.status(400).json({message: error.details[0].message})
    }
    const user= await User.findOne({username: req.body.username});
    if(!user){
        return res.status(400).json({message: "invalid username or password"})
    }
    const isMatchPassword = await bcrypt.compare(req.body.password, user.password)
    if(!isMatchPassword){
        return res.status(400).json({message: "invalid username or password"})
    }
    const token = jwt.sign({id:user._id, username: user.username}, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
    const {password, ...other } = user._doc;
    res.status(200).json({...other, token})
    
})



module.exports = {
    loginController,
    registerController
}