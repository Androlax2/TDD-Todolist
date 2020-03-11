module.exports = function(app) {
    const todoList = require('../controllers/todoListController');

    // todoList Routes
    app.route('/tasks')
        .get(todoList.listAllTasks);
};