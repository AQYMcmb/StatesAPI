const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var StateSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: {
        type: [String]
    },
}, {
    toJSON: {
        transform: function (doc, ret) {

        }
    }
});

// Compile model from schema
var State = mongoose.model('states', StateSchema);

module.exports = State;