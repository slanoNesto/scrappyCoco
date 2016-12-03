function init() {
    const cronJob = require('cron').CronJob;
    const Filter = require('./models/filter.model');
    const News = require('./models/news.model');
    const kurirService = require('./modules/scrape/scrapers/kurir.scrape.js');
    const blicService = require('./modules/scrape/scrapers/blic.scrape.js');

    const job = new cronJob({
        cronTime: '00 18 23 * * *', //every day at midnigh
        onTick: function() {
            console.log('onTick');
            Filter.getFilters(null, function(err, filters) {
                if (err) return console.log(err);

                Filter.getAllFilters((err, allFilters) => {
                    if (err) return console.log(err);

                    kurirService.getNews(filters, allFilters).then((data) => {
                        News.archive(data, function(err, news) {
                            if (err) { return console.log(err); }
                            console.log('Successful archive kurir');
                        });
                    }, (err) => {
                        console.log(err);
                    });

                    blicService.getNews(filters, allFilters).then((data) => {
                        News.archive(data, function(err, news) {
                            if (err) { return console.log(err); }
                            console.log('Successful archive blic');
                        });
                    }, (err) => {
                        console.log(err);
                    });

                });
            });
        },
        start: false
    });

    //job.start();
}

module.exports = {
    init
};
