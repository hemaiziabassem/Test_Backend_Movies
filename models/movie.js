const mongoose = require('mongoose');
const joi = require('joi');



const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    trailer: {
        type: String,
        required: true
    },
    added_date: {
        type: Date,
        default: Date.now
    },
    rating: {
        type: Number,
        default: 0
    }
})

function validationAddMovie(obj){
    const schema = joi.object({
        title: joi.string().trim().min(3).required(),
        description: joi.string().min(20).required(),
        image: joi.string().required(),
        trailer: joi.string().required(),
    })
    return schema.validate(obj);
}
function validationUpdateMovie(obj){
    const schema = joi.object({
        title: joi.string().min(3).trim(),
        description: joi.string().min(20).trim(),
        image: joi.string().required(),
        trailer: joi.string().required(),
    })
    return schema.validate(obj)
}



const Movie = mongoose.model('movies', movieSchema);

module.exports = {
    Movie,
    validationAddMovie,
    validationUpdateMovie
}