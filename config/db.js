const mongoose = require('mongoose');


function db_connect(){
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log('connected to MongoDB');
    } catch (error) {
        console.log('cannot connect', error)
        
    }
}



module.exports = db_connect;