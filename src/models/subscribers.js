// Ihis file is used to add datatype format of the data

const mongoose = require('mongoose');

const susbcriberSchema = new mongoose.Schema({
    //Datatype for the subscriber's name.
    name: {
        type: String,
        required: true,
    },

    //Datatype for the channel name.
    subscribedChannel:{
        type: String,
        required: true,
    },
    
    //Datatype for the Date.
    //By default the date is current time.
    subscribedDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Subscriber',susbcriberSchema);