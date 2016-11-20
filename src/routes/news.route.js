var bodyParser = require('body-parser');
var authService = require('../services/auth.service.js');
var blicService = require('../modules/scrape/scrapers/blic.scrape.js');
var kurirService = require('../modules/scrape/scrapers/kurir.scrape.js');

module.exports = function (app) {

    var Filter = require('../models/filter.model');
    var BASE = require('../config').baseUrl;

    app.use(bodyParser.json());

    app.get(BASE + '/news/blic', function(req, res) {
        let ids = req.query.filters;
        authService.authorize(req, res, function (user) {
            Filter.getFilters(ids, function(err, filters) {
                if (err) {
                    return res.status(500).send(err);
                }
                blicService.getNews(filters).then((data) => {
                    res.json(data);
                }, () => {
                    res.status(500).send(err);
                });
            });
        });
    });

    app.get(BASE + '/news/kurir', function(req, res) {
        let ids = req.query.filters;
        authService.authorize(req, res, function (user) {
            Filter.getFilters(ids, function(err, filters) {
                if (err) {
                    return res.status(500).send(err);
                }
                kurirService.getNews(filters).then((data) => {
                    res.json(data);
                }, () => {
                    res.status(500).send(err);
                });
            });
        });
    });

};
