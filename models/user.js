const mongoose = require('mongoose');
const joi = require('joi');



const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true
    },
    favoriteMovies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
      }],
      favoriteSeries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Serie' 
      }],
})

function validationRegisterUser(obj){
    const schema = joi.object({
        username: joi.string().trim().min(3).required(),
        email: joi.string().trim().email().required(),
        password: joi.string().min(6).required(),
    })
    return schema.validate(obj);
}
function validationLoginUser(obj){
    const schema = joi.object({
        username: joi.string().trim().min(3).required(),
        password: joi.string().min(6).required()
    })
    return schema.validate(obj);
}



const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    validationRegisterUser,
    validationLoginUser
}