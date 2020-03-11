const mongoose = require('mongoose'),
      Task = require('../../models/Task');

exports.listAllTasks = function(req, res) {
    Task.find({}, function(err, tasks) {
        if (err) res.send(err);
        res.json({
            success: true,
            data: tasks
        });
    });
};