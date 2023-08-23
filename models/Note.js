const mongoose = require('mongoose');
const autoIncreament = require('mongoose-sequence')(mongoose);

const noteSchema = new mongoose.Schema({
    username : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User' //this will refer the schema
    },
    title : {
        type : String,
        required : true
    },
    text : {
        type : String,
        required : true
    },
    completed : {
        type : boolean,
        required : false
    }
},
{
    timestamps : true
}
);

noteSchema.plugin(autoIncreament, {
    inc_field : 'ticket',
    id : ticketNums,
    start_seq : 500
});

module.exports = mongoose.model('Note', noteSchema);