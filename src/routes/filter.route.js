var bodyParser = require('body-parser');
var authService = require('../services/auth.service.js');

module.exports = function (app) {

    var BASE = require('../config').baseUrl;
    var Filter = require('../models/filter.model');

    app.use(bodyParser.json());

    app.get(BASE + '/filters', function(req, res) {
        authService.authorize(req, res, function (user) {

            Filter.getAllFilters(function(err, filters) {
                if (err) { res.status(500).send(err); return; }
                res.json(filters);
            });

        });
    });

};
