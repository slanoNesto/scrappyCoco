const bodyParser = require('body-parser');
const authService = require('../services/auth.service.js');
const blicService = require('../modules/scrape/scrapers/blic.scrape.js');
const kurirService = require('../modules/scrape/scrapers/kurir.scrape.js');

module.exports = function (app) {

    const Filter = require('../models/filter.model');
    const BASE = require('../config').baseUrl;

    app.use(bodyParser.json());

    app.get(BASE + '/news/blic', function(req, res) {
        handleScrapeRequest(req, res, blicService.getNews);
    });

    app.get(BASE + '/news/kurir', function(req, res) {
        handleScrapeRequest(req, res, kurirService.getNews);
    });

    function handleScrapeRequest(req, res, getNews) {
        let ids = req.query.filters;
        if (ids && !ids.join) return res.status(400).send('Bad Request');

        authService.authorize(req, res, function (user) {
            Filter.getFilters(ids, function(err, filters) {
                if (err) res.status(500).send(err);

                Filter.getAllFilters((err, allFilters) => {
                    if (err) res.status(500).send(err);

                    getNews(filters, allFilters).then((data) => {
                        res.json(data);
                    }, () => {
                        res.status(500).send(err);
                    });
                });
            });
        });
    }

};
