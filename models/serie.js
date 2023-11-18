const mongoose = require('mongoose');
const Joi = require('joi');

const seriesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
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
    },
    numberOfEpisodes: {
        type: Number,
        required: true
    },
    seasons: {
        type: Number,
        required: true
    }
});

function validateSeries(series) {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        description: Joi.string().min(20).required(),
        image: Joi.string().required(),
        trailer: Joi.string().required(),
        numberOfEpisodes: Joi.number().required(),
        seasons: Joi.number().required()
    });
    return schema.validate(series);
}

const Series = mongoose.model('Series', seriesSchema);

module.exports = {
    Series,
    validateSeries
};
