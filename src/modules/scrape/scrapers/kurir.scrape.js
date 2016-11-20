var request = require('request');
var cheerio = require('cheerio');
var {containsFilter} = require('../../../services/helpers.service.js');
var SingleNews = require('./../news.model.js');

//const FILTERS = require('./../filters.constant.js');
const NUMBER_OF_PAGES_TO_BE_SCRAPED = 10;

//LINKS
const SITE_ADDRESS = 'http://www.kurir.rs';
const MOST_RECENT_NEWS = SITE_ADDRESS + '/najnovije';

function getNews(filters) {
    let promises = [];
    let news = [];

    //kurir has paginated most recent news, calling pages in a loop, getting the filtered news
    //note: consider adding a timeout between requests to avoid being detected as ddos
    let i = 1;
    while (i < NUMBER_OF_PAGES_TO_BE_SCRAPED + 1) {
        let promise = new Promise((resolve, reject) => {
            let url = MOST_RECENT_NEWS + '?page=' + i;
            request(url, (error, response, body) => {
                if (!error && body) {
                    let dom = cheerio.load(body);
                    let filteredNews = scrape(dom, filters);
                    news = news.concat(filteredNews);

                    resolve(news);
                } else {
                    reject();
                }

            });
        });
        promises.push(promise);
        i++;
    }

    return Promise.all(promises).then(() => {
        return news;
    }, (error) => error);
}

//scrape the dom and return the data
function scrape($, FILTERS) {
    var filtered = [];
    var latestItems = $('.newsListModule').find('.newsListBlock');
    var listItem, a, text, link;

    for (var i = latestItems.length - 1; i >= 0; i--) {
        listItem = $(latestItems[i]);
        a = listItem.find('a.link');

        text = a.find('h2.title').text();
        link = SITE_ADDRESS + a.attr('href');

        let matchedFilters = containsFilter(text, FILTERS);
        if (matchedFilters) {
            filtered.push(new SingleNews(text, link, matchedFilters));
        }
    }

    return filtered;
}

module.exports = {
    getNews
};
