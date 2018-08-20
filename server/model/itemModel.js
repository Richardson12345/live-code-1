var mongoose = require('mongoose')
var Schema = mongoose.Schema

var itemSchema = new Schema({
    name: String,
    price: Number,
    stock: Number,
    tags: [{
        type: String
    }]
},{
timestamps: true
})

var itemModel = mongoose.model('Item', itemSchema)

module.exports = itemModel