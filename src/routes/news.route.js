const bodyParser = require('body-parser');
const authService = require('../services/auth.service.js');
const blicService = require('../modules/scrape/scrapers/blic.scrape.js');
const kurirService = require('../modules/scrape/scrapers/kurir.scrape.js');

module.exports = function (app) {

    const Filter = require('../models/filter.model');
    const BASE = require('../config').baseUrl;

    app.use(bodyParser.json());

    app.get(BASE + '/news/blic', function(req, res) {
        let ids = req.query.filters;
        authService.authorize(req, res, function (user) {
            Filter.getFilters(ids, function(err, filters) {
                if (err) res.status(500).send(err);

                Filter.getAllFilters((err, allFilters) => {
                    if (err) res.status(500).send(err);

                    blicService.getNews(filters, allFilters).then((data) => {
                        res.json(data);
                    }, () => {
                        res.status(500).send(err);
                    });
                });
            });
        });
    });

    app.get(BASE + '/news/kurir', function(req, res) {
        let ids = req.query.filters;
        authService.authorize(req, res, function (user) {
            Filter.getFilters(ids, function(err, filters) {
                if (err) res.status(500).send(err);

                Filter.getAllFilters((err, allFilters) => {
                    if (err) res.status(500).send(err);

                    kurirService.getNews(filters, allFilters).then((data) => {
                        res.json(data);
                    }, () => {
                        res.status(500).send(err);
                    });
                });
            });
        });
    });

};
