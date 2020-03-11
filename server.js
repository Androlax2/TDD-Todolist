const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = 3000,
    routes = require('./api/routes/todoListRoutes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text({defaultCharset: "utf-8"}));

routes(app); //register the route

module.exports = app;