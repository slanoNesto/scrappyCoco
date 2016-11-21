const request = require('request');
const cheerio = require('cheerio');
const {containsFilter} = require('../../../services/helpers.service.js');
const SingleNews = require('./../news.model.js');

//LINKS
const MOST_RECENT_NEWS = 'http://www.blic.rs/najnovije-vesti';

function getNews(filters) {
    return new Promise((resolve, reject) => {
        request(MOST_RECENT_NEWS, (error, response, body) => {

            if (!error && body) {
                let dom = cheerio.load(body);
                let news = scrape(dom, filters);

                resolve(news);
            } else {
                reject();
            }

        });
    });
}

//scrape the dom and return the data
function scrape($, FILTERS) {
    let filtered = [];
    let latestItems = $('#latestContainer').find('li');
    let listItem, a, text, link;

    for (let i = latestItems.length - 1; i >= 0; i--) {
        listItem = $(latestItems[i]);
        if (!listItem.hasClass('timeSplit')) {
            a = listItem.find('a');

            text = a.text();
            link = a.attr('href');

            let matchedFilters = containsFilter(text, FILTERS);
            if (matchedFilters) {
                filtered.push(new SingleNews(text, link, matchedFilters));
            }
        }
    }

    return filtered;
}

module.exports = {
    getNews
};
