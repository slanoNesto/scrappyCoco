const bodyParser = require('body-parser');
const authService = require('../services/auth.service.js');

module.exports = function (app) {

    const BASE = require('../config').baseUrl;
    const Filter = require('../models/filter.model');

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
