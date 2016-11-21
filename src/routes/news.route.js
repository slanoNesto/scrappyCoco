const bodyParser = require('body-parser');
const cache = require('memory-cache');
const authService = require('../services/auth.service.js');
const blicService = require('../modules/scrape/scrapers/blic.scrape.js');
const kurirService = require('../modules/scrape/scrapers/kurir.scrape.js');

module.exports = function (app) {

    const Filter = require('../models/filter.model');
    const BASE = require('../config').baseUrl;
    const CACHE_DURATION = require('../config').cacheDuration;

    app.use(bodyParser.json());

    app.get(BASE + '/news/blic', function(req, res) {
        let ids = req.query.filters;
        if (ids && !ids.join) return res.status(400).send('Bad Request');

        let cacheKey = ids ? 'blic' + ids.join('') : 'blic';

        let cached = cache.get(cacheKey);
        if (cached) return res.json(cached);

        authService.authorize(req, res, function (user) {
            Filter.getFilters(ids, function(err, filters) {
                if (err) res.status(500).send(err);

                Filter.getAllFilters((err, allFilters) => {
                    if (err) res.status(500).send(err);

                    blicService.getNews(filters, allFilters).then((data) => {
                        res.json(data);
                        cacheIt(cacheKey, data);
                    }, () => {
                        res.status(500).send(err);
                    });
                });
            });
        });
    });

    app.get(BASE + '/news/kurir', function(req, res) {
        let ids = req.query.filters;
        if (ids && !ids.join) return res.status(400).send('Bad Request');

        let cacheKey = ids ? 'kurir' + ids.join('') : 'kurir';

        let cached = cache.get(cacheKey);
        if (cached) return res.json(cached);

        authService.authorize(req, res, function (user) {
            Filter.getFilters(ids, function(err, filters) {
                if (err) res.status(500).send(err);

                Filter.getAllFilters((err, allFilters) => {
                    if (err) res.status(500).send(err);

                    kurirService.getNews(filters, allFilters).then((data) => {
                        cacheIt(cacheKey, data);
                        res.json(data);
                    }, () => {
                        res.status(500).send(err);
                    });
                });
            });
        });
    });

    function cacheIt(cacheKey, data) {
        if (!data || !data.length) return;
        cache.put(cacheKey, data, CACHE_DURATION);
    }

};
