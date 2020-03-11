const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: [{
            type: String,
            enum: ['pending', 'ongoing', 'completed']
        }],
        default: ['pending']
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Tasks', TaskSchema);