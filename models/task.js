var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    content: String,
    creator: String,
    usersToEdit: Array
});

module.exports = mongoose.model('Task', taskSchema);