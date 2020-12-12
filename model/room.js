const mongoose = require('mongoose');

const room = new mongoose.Schema({
    title: String,
    detail: String,
    price: Number,
    rate: String,
    img: {
        type: String,
        default: "no-picture.jpg"
    }
});


let RoomModel = mongoose.model('rooms', room);
module.exports = RoomModel;