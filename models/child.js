const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const Child = mongoose.model('Child', childSchema);

module.exports = Child;